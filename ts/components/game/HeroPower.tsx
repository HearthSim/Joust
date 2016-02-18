import * as React from "react";

import {EntityInPlayProps} from "../../interfaces";
import EntityInPlay from "./EntityInPlay";
import Cost from './stats/Cost';
import HeroPowerArt from './HeroPowerArt';
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
		var cardId = null;
		if (this.props.cards && this.props.cards.has(this.props.entity.getCardId())) {
			var data = this.props.cards.get(this.props.entity.getCardId());
			defaultCost = data.cost;
			cardId = data.id;
		}

		return (
			<div>
				<HeroPowerArt cardId={cardId} exhausted={this.props.entity.isExhausted()}/>
				<Cost cost={this.props.entity.getCost()} default={defaultCost}/>
			</div>
		);
	}
}

export default _.flow(
	EntityInPlay.DragSource(),
	EntityInPlay.DropTarget()
)(HeroPower);
