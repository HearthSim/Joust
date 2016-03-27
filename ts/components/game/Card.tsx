import * as React from "react";

import {EntityProps, OptionProps, CardDataProps} from "../../interfaces";

import Attack from './stats/Attack';
import Health from './stats/Health';
import Cost from './stats/Cost';

import InHandCardArt from './visuals/InHandCardArt';

import {DragSource} from 'react-dnd';
import {CardType} from "../../enums";
import {GameTag} from "../../enums";
import Entity from "../../Entity";

interface CardProps extends EntityProps, OptionProps, CardDataProps, React.Props<any> {
	style?: any;
	connectDragSource?(react: React.ReactElement<CardProps>);
	dragging?: boolean;
	isHidden?: boolean;
}

class Card extends React.Component<CardProps, {}> {

	public render(): JSX.Element {
		var entity = this.props.entity;
		var canBeRevealed = this.props.cards && this.props.cards.has(entity.getCardId());
		if (entity.getCardId() === null || (this.props.isHidden && !canBeRevealed)) {
			return (
				<div className="card">
					<InHandCardArt hidden={true} entity={this.props.entity} cardType={0}
						assetDirectory={this.props.assetDirectory}
						textureDirectory={this.props.textureDirectory}
						/>
				</div>
			);
		}

		var draggable = this.props.option && this.props.optionCallback;
		var classNames = ['card', 'revealed'];
		if (this.props.option) {
			classNames.push('playable');
		}
		if (draggable) {
			classNames.push('draggable');
		}
		if (entity.getTag(GameTag.COMBO)) {
			classNames.push('combo');
		}
		if (entity.getTag(GameTag.POWERED_UP)) {
			classNames.push('powered-up');
		}

		var title = entity.getCardId();
		var description = null;
		var defaultAttack = null;
		var defaultCost = null;
		var defaultHealth = null;
		var defaultDurability = null;
		var cardType = entity.getCardType();
		if (canBeRevealed) {
			var data = this.props.cards && this.props.cards.get(entity.getCardId());
			title = data.name;
			description = this.parseDescription(data.text);
			defaultAttack = data.attack;
			defaultCost = data.cost;
			defaultHealth = data.health;
			defaultDurability = data.durability;
			if (this.props.isHidden) {
				switch (data.type) {
					case 'MINION':
						cardType = CardType.MINION;
						break;
					case 'WEAPON':
						cardType = CardType.WEAPON;
						break;
					case 'SPELL':
						cardType = CardType.SPELL;
						break;
				}
			}
		}

		var stats = null;
		var textStyle = { color: "black" };

		switch (cardType) {
			case CardType.MINION:
				var attack = <Attack attack={!this.props.isHidden ? entity.getAtk() : defaultAttack}
					default={defaultAttack}/>;
				var health = <Health health={!this.props.isHidden ? entity.getHealth() : defaultHealth}
					damage={entity.getDamage() }
					default={defaultHealth}/>;
				stats = <div className="stats">{attack}{health}</div>;
				break;
			case CardType.WEAPON:
				var attack = <Attack attack={!this.props.isHidden ? entity.getAtk() : defaultAttack}
					default={defaultAttack}/>;
				var durability = <div
					className="durability">{!this.props.isHidden ? entity.getDurability() : defaultDurability}</div>;
				stats = <div className="stats">{attack}{durability}</div>;
				textStyle = { color: "white" };
		}

		if (this.props.isHidden) {
			classNames.push('hidden-card');
		}

		if (this.props.dragging) {
			classNames.push('dragging');
		}

		var connectDragSource = this.props.connectDragSource;
		var jsx = (
			<div className={classNames.join(' ') } style={this.props.style}>
				<InHandCardArt entity={entity} hidden={false} cardType={cardType}
					cards={this.props.cards}
					assetDirectory={this.props.assetDirectory}
					textureDirectory={this.props.textureDirectory}
					/>
				<Cost cost={!this.props.isHidden ? entity.getCost() : defaultCost} default={defaultCost}/>
				<h1>{title}</h1>
				<div className="description">
					<p style={textStyle} dangerouslySetInnerHTML={{ __html: description }}></p>
				</div>
				{stats}
			</div>
		);

		return (draggable ? connectDragSource(jsx) : jsx);
	}

	protected parseDescription(description: string): string {
		if (!description) {
			return '';
		}

		let modifier = (bonus: number, double: number) => {
			return (match: string, part1: string) => {
				let number = +part1;
				if (+bonus !== 0 || +double !== 0) {
					number += bonus;
					number *= Math.pow(2, double);
					return '*' + number + '*'
				}
				return '' + number;
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
		return description;
	}
}

export default DragSource('card', {
	beginDrag: function(props: CardProps) {
		return {
			option: props.option,
			action: props.optionCallback
		};
	}
},
	function(connect, monitor) {
		return {
			connectDragSource: connect.dragSource(),
			dragging: monitor.isDragging()
		}
	})(Card);
