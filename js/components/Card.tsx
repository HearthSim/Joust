/// <reference path="../../typings/react/react.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
'use strict';

import React = require('react');

import {EntityProps, OptionProps} from "../interfaces";
import HearthstoneJSON = require("../metadata/HearthstoneJSON");

interface CardProps extends EntityProps, OptionProps, React.Props<any> {

}


var i = 0;
class Card extends React.Component<CardProps, {}> {

	protected onStop(e, ui) {
		console.log(e, ui);
		console.log(this.state);
	}

	public render() {
		var entity = this.props.entity;
		if (entity.getCardId() !== null) {
			var classNames = ['card', 'revealed'];
			if (this.props.option) {
				classNames.push('playable');
			}
			var cost = <div className="cost">{entity.getCost()}</div>;
			var stats = null;
			if (entity.getCardType() === 4) {
				var attack = <div className="atk">{entity.getAtk()}</div>;
				var health = <div className="health">{entity.getHealth()}</div>;
				stats = <div className="stats">{attack}{health}</div>
			}
			if (entity.getCardType() === 7) {
				var attack = <div className="atk">{entity.getAtk()}</div>;
				var durability = <div className="durability">{entity.getDurability()}</div>;
				stats = <div className="stats">{attack}{durability}</div>
			}

			var title = HearthstoneJSON.has(entity.getCardId()) ? HearthstoneJSON.get(entity.getCardId()).name : entity.getCardId();

			return (
				<div className={classNames.join(' ')}>
					{cost}
					<h1>
						{title}
					</h1>
					<p className="description">
					</p>
					{stats}
				</div>
			);
		}
		else {
			return (
				<div className="card"></div>
			);
		}
	}
}

export = Card;
