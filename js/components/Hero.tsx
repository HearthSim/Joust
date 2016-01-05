/// <reference path="../../typings/react/react.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
import HearthstoneJSON = require("../metadata/HearthstoneJSON");
'use strict';

import React = require('react');

import EntityInPlay = require('./EntityInPlay');
import {EntityInPlayProps} from "../interfaces";
import Entity = require('../Entity');
import Secrets = require('./Secrets');
import Attack = require('./stats/Attack')
import Health = require('./stats/Health')
import _ = require('lodash');

interface HeroProps extends EntityInPlayProps {
	secrets: Immutable.Map<number, Entity>;
}

class Hero extends EntityInPlay<HeroProps, {}> {
	constructor() {
		super('hero');
	}

	protected jsx() {
		var entity = this.props.entity;

		var title = this.props.entity.getCardId();
		if (HearthstoneJSON.has(this.props.entity.getCardId())) {
			var data = HearthstoneJSON.get(this.props.entity.getCardId());
			var title = '' + data.name;
		}

		var classNames = this.props.option ? 'hero playable' : 'hero';
		var health = null;
		var attack = entity.getAtk() ? <Attack attack={entity.getAtk()}/> : null;
		return (
			<div>
				<Secrets entities={this.props.secrets}/>
				<h1>{title}</h1>

				<div className="stats">
					{attack}
					<Health health={entity.getHealth()} damage={entity.getDamage()}/>
				</div>
			</div>
		);
	}
}

export = _.flow(
	EntityInPlay.DragSource(),
	EntityInPlay.DropTarget()
)(Hero);
