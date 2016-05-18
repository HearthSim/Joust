import * as React from "react";

import {EntityInPlayProps} from "../../interfaces";
import EntityInPlay from "./EntityInPlay";
import Cost from "./stats/Cost";
import HeroPowerArt from "./visuals/HeroPowerArt";
import * as _ from "lodash";

class HeroPower extends EntityInPlay<EntityInPlayProps, {}> {
	constructor() {
		super('heroPower');
	}

	protected playWithClick(): boolean {
		return true;
	}

	protected jsx() {
		var defaultCost = null;
		if (this.props.cards && this.props.cards.has(this.props.entity.getCardId())) {
			var data = this.props.cards.get(this.props.entity.getCardId());
			defaultCost = data.cost;
		}

		return [,
			<HeroPowerArt key="heroPower" entity={this.props.entity} cards={this.props.cards} assetDirectory={this.props.assetDirectory} cardArtDirectory={this.props.cardArtDirectory}/>,
			<Cost key="cost" cost={this.props.entity.getCost() } default={defaultCost}/>
		];
	}
}

export default _.flow(
	EntityInPlay.DragSource(),
	EntityInPlay.DropTarget()
)(HeroPower);
