/// <reference path="../../typings/react/react.d.ts"/>
/// <reference path="../../typings/react-dnd/react-dnd.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
'use strict';

import React = require('react');
import EntityInPlay = require('./EntityInPlay');
import {EntityInPlayProps} from "../interfaces";
import HearthstoneJSON = require("../metadata/HearthstoneJSON");

import Attack = require('./stats/Attack');
import Health = require('./stats/Health');

import {DragSource, DropTarget} from 'react-dnd';
import _ = require('lodash');

class Minion extends EntityInPlay<EntityInPlayProps, {}> {

	constructor() {
		super('minion');
	}

	public jsx() {
		var entity = this.props.entity;

		var title = entity.getCardId();
		var defaultAttack = null;
		var defaultHealth = null;
		if (HearthstoneJSON.has(entity.getCardId())) {
			var data = HearthstoneJSON.get(entity.getCardId());
			title = data.name;
			defaultAttack = data.attack;
			defaultHealth = data.health;
		}

		return (
			<div>
				<h1>{title}</h1>
				<div className="stats">
					<Attack attack={entity.getAtk()} default={defaultAttack}/>
					<Health health={entity.getHealth()} damage={entity.getDamage()} default={defaultHealth}/>
				</div>
			</div>
		);
	}
}

export = _.flow(
	EntityInPlay.DragSource(),
	EntityInPlay.DropTarget()
)(Minion);
