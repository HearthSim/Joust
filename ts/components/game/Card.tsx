import * as React from "react";

import {EntityProps, OptionProps, CardDataProps} from "../../interfaces";

import Attack from './stats/Attack';
import Health from './stats/Health';
import Cost from './stats/Cost';

import InHandCardArt from './InHandCardArt';

import {DragSource} from 'react-dnd';

interface CardProps extends EntityProps, OptionProps, CardDataProps, React.Props<any> {
	style?:any;
	connectDragSource?(react:React.ReactElement<CardProps>);
	dragging?:boolean;
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
		if (this.props.cards && this.props.cards.has(entity.getCardId())) {
			var data = this.props.cards.get(entity.getCardId());
			title = data.name;
			description = data.text;
			defaultAttack = data.attack;
			defaultCost = data.cost;
			defaultHealth = data.health;
		}

		var stats = null;
		var textStyle = {color: "black"};
		if (entity.getCardType() === 4) {
			var attack = <Attack attack={entity.getAtk()} default={defaultAttack}/>;
			var health = <Health health={entity.getHealth()} damage={entity.getDamage()} default={defaultHealth}/>;
			stats = <div className="stats">{attack}{health}</div>
		}
		if (entity.getCardType() === 7) {
			var attack = <Attack attack={entity.getAtk()} default={defaultAttack}/>;
			var durability = <div className="durability">{entity.getDurability()}</div>;
			stats = <div className="stats">{attack}{durability}</div>
			textStyle = {color: "white"};
		}

		if (this.props.dragging) {
			classNames.push('dragging');
		}

		var connectDragSource = this.props.connectDragSource;
		var jsx = (
			<div className={classNames.join(' ')} style={this.props.style}>
				<InHandCardArt cardId={entity.getCardId()} cardType={entity.getCardType()}
							   legendary={entity.isLegendary()}/>
				<Cost cost={entity.getCost()} default={defaultCost}/>
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
