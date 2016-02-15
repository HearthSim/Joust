import * as React from "react";

import {EntityProps, OptionProps, CardDataProps} from "../../interfaces";

import Attack from './stats/Attack';
import Health from './stats/Health';
import Cost from './stats/Cost';

import InHandCardArt from './InHandCardArt';

import {DragSource} from 'react-dnd';
import {CardType} from "../../enums";

interface CardProps extends EntityProps, OptionProps, CardDataProps, React.Props<any> {
	style?:any;
	connectDragSource?(react:React.ReactElement<CardProps>);
	dragging?:boolean;
	isHidden?:boolean;
}

class Card extends React.Component<CardProps, {}> {

	public render():JSX.Element {
		var entity = this.props.entity;
		if (entity.getCardId() === null) {
			return <div className="card">
				<InHandCardArt cardHidden={true}/>
			</div>;
		}

		var draggable = this.props.option && this.props.optionCallback;
		var classNames = ['card', 'revealed'];
		if (this.props.option) {
			classNames.push('playable');
		}
		if (draggable) {
			classNames.push('draggable');
		}
		if (entity.isPoweredUp()) {
			classNames.push('powered-up');
		}

		var title = entity.getCardId();
		var description = null;
		var defaultAttack = null;
		var defaultCost = null;
		var defaultHealth = null;
		var defaultDurability = null;
		var cardType = entity.getCardType();
		if (this.props.cards && this.props.cards.has(entity.getCardId())) {
			var data = this.props.cards.get(entity.getCardId());
			title = data.name;
			description = data.text;
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
		var textStyle = {color: "black"};

		switch (cardType) {
			case CardType.MINION:
				var attack = <Attack attack={!this.props.isHidden ? entity.getAtk() : defaultAttack}
									 default={defaultAttack}/>;
				var health = <Health health={!this.props.isHidden ? entity.getHealth() : defaultHealth}
									 damage={entity.getDamage()}
									 default={defaultHealth}/>;
				stats = <div className="stats">{attack}{health}</div>
				break;
			case CardType.WEAPON:
				var attack = <Attack attack={!this.props.isHidden ? entity.getAtk() : defaultAttack}
									 default={defaultAttack}/>;
				var durability = <div
					className="durability">{!this.props.isHidden ? entity.getDurability() : defaultDurability}</div>;
				stats = <div className="stats">{attack}{durability}</div>;
				textStyle = {color: "white"};
		}

		if (this.props.isHidden) {
			classNames.push('hidden');
		}

		if (this.props.dragging) {
			classNames.push('dragging');
		}

		var connectDragSource = this.props.connectDragSource;
		var jsx = (
			<div className={classNames.join(' ')} style={this.props.style}>
				<InHandCardArt cardId={entity.getCardId()} cardType={cardType}
							   legendary={entity.isLegendary()}/>
				<Cost cost={!this.props.isHidden ? entity.getCost() : defaultCost} default={defaultCost}/>
				<h1>{title}</h1>
				<div className="description">
					<p style={textStyle} dangerouslySetInnerHTML={{__html: description}}></p>
				</div>
				{stats}
			</div>
		);

		return (draggable ? connectDragSource(jsx) : jsx);
	}
}

export default DragSource('card', {
		beginDrag: function (props:CardProps) {
			return {
				option: props.option,
				action: props.optionCallback
			};
		}
	},
	function (connect, monitor) {
		return {
			connectDragSource: connect.dragSource(),
			dragging: monitor.isDragging()
		}
	})(Card);
