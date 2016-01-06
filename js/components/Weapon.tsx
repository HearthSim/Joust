/// <reference path="../../typings/react/react.d.ts"/>
import HearthstoneJSON = require("../metadata/HearthstoneJSON");
'use strict';

import React = require('react');
import {EntityProps} from "../interfaces";
import Attack = require('./stats/Attack');
import Durability = require('./stats/Durability');

interface WeaponProps extends EntityProps, React.Props<any> {

}

class Weapon extends React.Component<WeaponProps, {}> {

	public render() {
		if(this.props.entity) {
			var entity = this.props.entity;

			var title = entity.getCardId();
			var defaultAttack = null;
			var defaultDurability = null;
			if (HearthstoneJSON.has(entity.getCardId())) {
				var data = HearthstoneJSON.get(entity.getCardId());
				var title = '' + data.name;
				defaultAttack = data.attack;
				defaultDurability = data.durability;
			}

			return (
				<div className="weapon">
					<h1>{title}</h1>
					<div className="stats">
						<Attack attack={entity.getAtk()} default={defaultAttack} />
						<Durability durability={entity.getDurability()} damage={entity.getDamage()} default={defaultDurability} />
					</div>
				</div>
			);
		}
		else {
			return (
				<div className="weapon no-entity"></div>
			);
		}
	}
}

export = Weapon;
