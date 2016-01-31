/// <reference path="../../typings/react/react.d.ts"/>
/// <reference path="../../typings/react-dnd/react-dnd.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>

import * as React from 'react';
import EntityInPlay from './EntityInPlay';
import {EntityInPlayProps} from "../interfaces";
import HearthstoneJSON from "../metadata/HearthstoneJSON";

import InPlayCardArt from './InPlayCardArt';

import Attack from './stats/Attack';
import Health from './stats/Health';

import {DragSource, DropTarget} from 'react-dnd';
import * as _ from 'lodash';

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
				<InPlayCardArt taunt={entity.isTaunter()} legendary={entity.isLegendary()} cardId={entity.getCardId()}/>
				<div className="stats">
					<Attack attack={entity.getAtk()} default={defaultAttack}/>
					<Health health={entity.getHealth()} damage={entity.getDamage()} default={defaultHealth}/>
				</div>
			</div>
		);
	}
}

export default _.flow(
	EntityInPlay.DragSource(),
	EntityInPlay.DropTarget()
)(Minion);
