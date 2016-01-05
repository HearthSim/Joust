/// <reference path="../../typings/react/react.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
'use strict';

import React = require('react');

import {EntityInPlayProps} from "../interfaces";
import EntityInPlay = require("./EntityInPlay");
import Cost = require('./stats/Cost');
import HearthstoneJSON = require('../metadata/HearthstoneJSON');
import _ = require('lodash');

class HeroPower extends EntityInPlay<EntityInPlayProps, {}> {
	constructor() {
		super('heroPower');
	}

	protected jsx() {
		var defaultCost = null;
		if (HearthstoneJSON.has(this.props.entity.getCardId())) {
			var data = HearthstoneJSON.get(this.props.entity.getCardId());
			defaultCost = data.cost;
		}

		return (
			<div>
				<Cost cost={this.props.entity.getCost()} default={defaultCost}/>
			</div>
		);
	}
}

export = _.flow(
	EntityInPlay.DragSource(),
	EntityInPlay.DropTarget()
)(HeroPower);
