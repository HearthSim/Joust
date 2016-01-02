/// <reference path="../../typings/react/react-global.d.ts"/>
'use strict';

import {EntityProps} from "../interfaces";

interface CardProps extends EntityProps, React.Props<any> {

}

class Card extends React.Component<CardProps, {}> {

	public render() {
		var entity = this.props.entity;
		if (entity.getCardId() !== null) {
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

			return (
				<div className="card revealed">
					{cost}
					<h1 style={{clear: "both"}}>
						{entity.getCardId()}
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
