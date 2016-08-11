import * as React from "react";

import {EntityInPlayProps} from "../../interfaces";
import EntityInPlay from "./EntityInPlay";
import Cost from "./stats/Cost";
import HeroPowerArt from "./visuals/HeroPowerArt";
import {GameTag} from "../../enums";

class HeroPower extends EntityInPlay<EntityInPlayProps> {
	constructor() {
		super('heroPower');
	}

	protected playWithClick():boolean {
		return true;
	}

	protected jsx() {
		var defaultCost = null;
		if (this.props.cards && this.props.cards.has(this.props.entity.cardId)) {
			var data = this.props.cards.get(this.props.entity.cardId);
			defaultCost = data.cost;
		}

		let entity = this.props.entity;
		if (this.state.isHovering) {
			entity = entity.setTag(GameTag.EXHAUSTED, 0);
		}

		let components = [
			<HeroPowerArt
				key="art"
				entity={entity}
				cards={this.props.cards}
				assetDirectory={this.props.assetDirectory}
				cardArtDirectory={this.props.cardArtDirectory}
			/>
		];

		if (!entity.isExhausted()) {
			components.push(<Cost
				key="cost"
				cost={entity.getCost()}
				default={defaultCost}
			/>);
		}

		return components;
	}
}

export default HeroPower;
