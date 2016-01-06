/// <reference path="../../typings/react/react.d.ts"/>
/// <reference path="../../typings/react-dnd/react-dnd.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
'use strict';

import React = require('react');

import {EntityProps, OptionProps} from "../interfaces";
import HearthstoneJSON = require("../metadata/HearthstoneJSON");

import Attack = require('./stats/Attack');
import Health = require('./stats/Health');
import Cost = require('./stats/Cost');

import {DragSource} from 'react-dnd';

interface CardProps extends EntityProps, OptionProps, React.Props<any> {
	connectDragSource?(param:any);
	isDragging?:boolean;
}

class Card extends React.Component<CardProps, {}> {

	protected play() {
		if (!this.props.option || !this.props.optionCallback) {
			return;
		}
		var target = null;
		if (this.props.option.hasTargets()) {
			console.warn('Valid target(s): ' + this.props.option.getTargets().join(', '));
			target = this.props.option.getTargets()[0];
		}
		this.props.optionCallback(this.props.option, target);
	}

	public render() {
		var entity = this.props.entity;
		if (entity.getCardId() === null) {
			return <div className="card"></div>;
		}

		var classNames = ['card', 'revealed'];
		if (this.props.option) {
			classNames.push('playable');
		}
		if (entity.isPoweredUp()) {
			classNames.push('powered-up');
		}

		var title = entity.getCardId();
		var description = null;
		var defaultAttack = null;
		var defaultCost = null;
		var defaultHealth = null;
		if (HearthstoneJSON.has(entity.getCardId())) {
			var data = HearthstoneJSON.get(entity.getCardId());
			title = data.name;
			description = data.text;
			defaultAttack = data.attack;
			defaultCost = data.cost;
			defaultHealth = data.health;
		}

		var stats = null;
		if (entity.getCardType() === 4) {
			var attack = <Attack attack={entity.getAtk()} default={defaultAttack}/>;
			var health = <Health health={entity.getHealth()} damage={entity.getDamage()} default={defaultHealth}/>;
			stats = <div className="stats">{attack}{health}</div>
		}
		if (entity.getCardType() === 7) {
			var attack = <Attack attack={entity.getAtk()} default={defaultAttack}/>;
			var durability = <div className="durability">{entity.getDurability()}</div>;
			stats = <div className="stats">{attack}{durability}</div>
		}

		var connectDragSource = this.props.connectDragSource;
		var jsx = (
			<div className={classNames.join(' ')}>
				<Cost cost={entity.getCost()} default={defaultCost}/>
				<h1>{title}</h1>
				<p className="description" dangerouslySetInnerHTML={{__html: description}}></p>
				{stats}
			</div>
		);

		return (this.props.option ? connectDragSource(jsx) : jsx);
	}
}

export = DragSource('card', {
		beginDrag: function(props:CardProps) {
			return {
				option: props.option,
				action: props.optionCallback
			};
		}
	},
	function(connect, monitor) {
		return {
			connectDragSource: connect.dragSource(),
			isDragging: monitor.isDragging()
		}
	})(Card);
