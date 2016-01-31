/// <reference path="../../typings/react/react.d.ts"/>
/// <reference path="../interfaces.d.ts"/>

import * as React from 'react';

import {EntityInPlayProps} from "../interfaces";
import EntityInPlay from "./EntityInPlay";
import Cost from './stats/Cost';
import HearthstoneJSON from '../metadata/HearthstoneJSON';
import * as _ from 'lodash';

class HeroPower extends EntityInPlay<EntityInPlayProps, {}> {
	constructor() {
		super('heroPower');
	}

	protected playWithClick():boolean {
		return true;
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

export default _.flow(
	EntityInPlay.DragSource(),
	EntityInPlay.DropTarget()
)(HeroPower);
