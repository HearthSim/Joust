/// <reference path="../../typings/react/react.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
'use strict';

import React = require('react');

import {EntityProps, OptionProps} from "../interfaces";
import HearthstoneJSON = require("../metadata/HearthstoneJSON");

import Attack = require('./stats/Attack');
import Health = require('./stats/Health');
import Cost = require('./stats/Cost');

interface CardProps extends EntityProps, OptionProps, React.Props<any> {

}


var i = 0;
class Card extends React.Component<CardProps, {}> {

	protected play() {
		if (!this.props.option || !this.props.optionCallback) {
			return;
		}
		this.props.optionCallback(this.props.option);
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

		var title = null;
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

		return (
			<div className={classNames.join(' ')} onClick={this.play.bind(this)}>
				<Cost cost={entity.getCost()} default={defaultCost}/>
				<h1>
					{title}
				</h1>
				<p className="description" dangerouslySetInnerHTML={{__html: description}}></p>
				{stats}
			</div>
		);
	}
}

export = Card;
