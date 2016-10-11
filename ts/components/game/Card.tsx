import * as React from "react";
import * as _ from "lodash";
import * as Sunwell from "sunwell";
import {EntityProps, OptionProps} from "../../interfaces";
import InHandCardArt from "./visuals/InHandCardArt";
import {CardType, GameTag} from "../../enums";

interface CardProps extends EntityProps, OptionProps, React.ClassAttributes<Card> {
	style?: any;
	isHidden?: boolean;
	defaultStats?: boolean;
	mulligan?: boolean;
}

export default class Card extends React.Component<CardProps, void> {

	private img: HTMLImageElement;

	private sunwell(): void {
		if (!this.img) {
			return;
		}

		let entity = this.props.entity;
		let settings = {} as any;

		if (!entity.cardId || !this.props.cards || !this.props.cards.has(entity.cardId)) {
			return;
		}

		let data = this.props.cards.get(entity.cardId);

		settings = data;
		settings.cost = entity.getTag(GameTag.COST) || data.cost;
		settings.health = entity.getTag(GameTag.HEALTH) - entity.getTag(GameTag.DAMAGE) || data.health;
		settings.attack = entity.getTag(GameTag.ATK) || data.attack;
		settings.texture = entity.cardId;
		if (!settings.text) {
			settings.text = "";
		}

		if (entity.getTag(GameTag.DAMAGE) > 0) {
			settings.healthStyle = "-";
		}
		else if (entity.getTag(GameTag.HEALTH) > data.health) {
			settings.healthStyle = "+";
		}

		if (settings.attack > data.attack) {
			settings.attackStyle = "+";
		}

		if (settings.cost > data.cost) {
			settings.costStyle = "-";
		}
		else if (settings.cost < data.cost) {
			settings.costStyle = "+";
		}

		if (entity.getTag(GameTag.SILENCED)) {
			settings.silenced = true;
		}

		if (this.props.controller.getTag(GameTag.SPELLS_COST_HEALTH)) {
			settings.costHealth = true;
		}

		if (!settings.playerClass) {
			settings.playerClass = "Neutral";
		}

		Sunwell.createCard(settings, 512, this.img);
	}

	public componentDidMount() {
		this.sunwell();
	}

	public componentDidUpdate() {
		this.sunwell();
	}

	public shouldComponentUpdate(nextProps: CardProps, nextState: any): boolean {
		return (
			!_.isEqual(this.props.style, nextProps.style) ||
			this.props.isHidden !== nextProps.isHidden ||
			this.props.entity !== nextProps.entity ||
			this.props.damage !== nextProps.damage ||
			this.props.healing !== nextProps.healing ||
			this.props.option !== nextProps.option ||
			this.props.cards !== nextProps.cards ||
			this.props.controller !== nextProps.controller ||
			this.props.assetDirectory !== nextProps.assetDirectory ||
			this.props.cardArtDirectory !== nextProps.cardArtDirectory
		);
	}

	public render(): JSX.Element {
		let entity = this.props.entity;
		let canBeRevealed = this.props.cards && this.props.cards.has(entity.cardId);
		if (entity.cardId === null || (this.props.isHidden && !canBeRevealed)) {
			return (
				<div className={"card"}>
					<InHandCardArt
						hidden={true}
						entity={this.props.entity}
						assetDirectory={this.props.assetDirectory}
						cardArtDirectory={this.props.cardArtDirectory}
						mulligan={this.props.mulligan}
					/>
				</div>
			);
		}

		let classNames = ["card", "revealed"];
		if (this.props.option) {
			classNames.push("playable");
		}
		if (entity.getTag(GameTag.COMBO)) {
			classNames.push("combo");
		}
		if (entity.getTag(GameTag.POWERED_UP)) {
			classNames.push("powered-up");
		}
		if (entity.getTag(GameTag.SHIFTING)) {
			classNames.push("shifting");
		}
		if (entity.getTag(GameTag.CHOOSE_BOTH)) {
			classNames.push("choose-both");
		}
		if (this.props.mulligan) {
			classNames.push("mulligan");
		}

		return <div className={classNames.join(" ")}><img ref={(ref) => (this.img = ref)} className="card" /></div>;

	}

	private getStatValue(tag: GameTag, defaultValue: number): number {
		let value = this.props.entity.getTag(tag);
		if (this.props.defaultStats || this.props.isHidden && !value) {
			return defaultValue;
		}
		return value;
	}

	protected parseDescription(description: string): string {
		if (!description) {
			return "";
		}

		let modifier = (bonus: number, double: number) => {
			return (match: string, part1: string) => {
				let value = +part1;
				if (+bonus !== 0 || +double !== 0) {
					value += bonus;
					value *= Math.pow(2, double);
					return "*" + value + "*";
				}
				return "" + value;
			};
		};

		let damageBonus = 0;
		let damageDoubling = 0;
		let healingDoubling = 0;

		if (this.props.controller) {
			switch (this.props.entity.getCardType()) {
				case CardType.SPELL:
					damageBonus = this.props.controller.getTag(GameTag.CURRENT_SPELLPOWER);
					if (this.props.entity.getTag(GameTag.RECEIVES_DOUBLE_SPELLDAMAGE_BONUS) > 0) {
						damageBonus *= 2;
					}
					damageDoubling = this.props.controller.getTag(GameTag.SPELLPOWER_DOUBLE);
					healingDoubling = this.props.controller.getTag(GameTag.HEALING_DOUBLE);
					break;
				case CardType.HERO_POWER:
					damageBonus = this.props.controller.getTag(GameTag.CURRENT_HEROPOWER_DAMAGE_BONUS);
					damageDoubling = this.props.controller.getTag(GameTag.HERO_POWER_DOUBLE);
					healingDoubling = this.props.controller.getTag(GameTag.HERO_POWER_DOUBLE);
					break;
			}
		}

		description = description.replace(/\$(\d+)/g, modifier(damageBonus, damageDoubling));
		description = description.replace(/#(\d+)/g, modifier(0, healingDoubling));

		// custom line breaks
		if (description.match(/^\[x\]/)) {
			description = description.replace(/^\[x\]/, "");
			// enable this when font-sizing is optimizied
			//description = description.replace(/\n/g, "<br>");
		}

		// remove non-breaking spaces
		description = description.replace(String.fromCharCode(160), " ");

		return description.trim();
	}
}
