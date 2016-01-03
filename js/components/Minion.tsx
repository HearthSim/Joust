/// <reference path="../../typings/react/react.d.ts"/>
'use strict';

import React = require('react');
import {EntityProps, OptionProps} from "../interfaces";
import HearthstoneJSON = require("../metadata/HearthstoneJSON");

import Attack = require('./stats/Attack');
import Health = require('./stats/Health');

interface MinionProps extends EntityProps, OptionProps, React.Props<any> {

}

class Minion extends React.Component<MinionProps, {}> {

	public render() {
		var classNames = ['minion'];
		if (this.props.option) {
			classNames.push('playable');
		}
		var entity = this.props.entity;
		var atkClasses = ['atk'];
		var healthClasses = ['health'];
		if (entity.getDamage() > 0) {
			healthClasses.push('negative');
		}

		var title = null;
		var defaultAttack = null;
		var defaultHealth = null;
		if (HearthstoneJSON.has(entity.getCardId())) {
			var data = HearthstoneJSON.get(entity.getCardId());
			title = data.name;
			defaultAttack = data.attack;
			defaultHealth = data.health;
		}

		return (
			<div className={classNames.join(' ')}>
				<h1>{title}</h1>
				<div className="stats">
					<Attack attack={entity.getAtk()} default={defaultAttack}/>
					<Health health={entity.getHealth()} damage={entity.getDamage()} default={defaultHealth}/>
				</div>
			</div>
		);
	}
}

export = Minion;
