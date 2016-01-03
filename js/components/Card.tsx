/// <reference path="../../typings/react/react-global.d.ts"/>
import HearthstoneJSON = require("../metadata/HearthstoneJSON");
'use strict';

import {EntityProps, OptionProps} from "../interfaces";

interface CardProps extends EntityProps, OptionProps, React.Props<any> {

}

class Card extends React.Component<CardProps, {}> {

	public render() {
		var entity = this.props.entity;
		if (entity.getCardId() !== null) {
			var classNames = ['card', 'revealed'];
			if(this.props.option) {
				classNames.push('playable');
			}
			var cost = <div className="cost">{entity.getCost()}</div>;
			var stats = null;
			if (entity.getCardType() === 4) {
				var attack = <div className="atk">{entity.getAtk()}</div>;
				var health = <div className="health">{entity.getHealth()}</div>;
				stats = <div className="stats">{attack}{health}</div>
			}
			if(entity.getCardType() === 7) {
				var attack = <div className="atk">{entity.getAtk()}</div>;
				var durability = <div className="durability">{entity.getDurability()}</div>;
				stats = <div className="stats">{attack}{durability}</div>
			}

			var title = HearthstoneJSON.has(entity.getCardId()) ? HearthstoneJSON.get(entity.getCardId()).name : entity.getCardId();

			return (
				<div className={classNames.join(' ')}>
					{cost}
					<h1 style={{clear: "both"}}>
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
