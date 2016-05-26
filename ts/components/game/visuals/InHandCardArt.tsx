import * as React from "react";
import {CardType,CardClass,GameTag} from "../../../enums";
import Entity from "../../../Entity";
import CardArt from "./CardArt";
import {EntityProps} from "../../../interfaces";
import InPlayCardArt from "./InPlayCardArt";

interface InHandCardArtProps extends EntityProps {
	hidden: boolean;
	cardType: number;
	cardClass: number;
}

class InHandCardArt extends React.Component<InHandCardArtProps, {}> {
	public render(): JSX.Element {
		var images = [];
		var entity = this.props.entity;
		var portraitClass = null;
		var frame = null;

		if (this.props.hidden) {
			images.push({
				image: "cardback.png",
				classes: ["inhand-base", "cardback"]
			});
		} else {
			switch (this.props.cardType) {
				case CardType.MINION:
					portraitClass = "inhand-minion";
					if (entity.isPremium()) {
						frame = "inhand_minion_premium.png"
					} else {
						frame = "inhand_minion_" + this.CardClassString() + ".png";
					}
					break;
				case CardType.SPELL:
					portraitClass = "inhand-spell";
					if (entity.isPremium()) {
						frame = "inhand_spell_premium.png"
					} else {
						frame = "inhand_spell_" + this.CardClassString() + ".png";
					}
					break;
				case CardType.WEAPON:
					portraitClass = "inhand-weapon";
					if (entity.isPremium()) {
						frame = "inhand_weapon_premium.png"
					} else {
						frame = "inhand_weapon_neutral.png";
					}
					break;
			}

			images.push({
				image: entity.getCardId(),
				isArt: true,
				classes: [portraitClass]
			});
		}

		images.push({
			image: frame,
			classes: ["inhand-base"]
		});

		if (entity.isLegendary()) {
			images.push({
				image: "inhand_minion_legendary"
					+ (entity.isPremium() ? "_premium" : "") + ".png",
				classes: ["inhand-legendary"]
			});
		}

		return (
			<CardArt layers={images} scale={0.71} square={false} margin={false} assetDirectory={this.props.assetDirectory} cardArtDirectory={this.props.cardArtDirectory} />
		);
	}

	private CardClassString(): string {
		switch (this.props.cardClass) {
			case CardClass.DRUID:
				return "druid";
			case CardClass.HUNTER:
				return "hunter";
			case CardClass.MAGE:
				return "mage";
			case CardClass.PALADIN:
				return "paladin";
			case CardClass.PRIEST:
				return "priest";
			case CardClass.ROGUE:
				return "rogue";
			case CardClass.SHAMAN:
				return "shaman";
			case CardClass.WARLOCK:
				return "warlock";
			case CardClass.WARRIOR:
				return "warrior";
			default:
				return "neutral";
		}
	}
}

export default InHandCardArt;
