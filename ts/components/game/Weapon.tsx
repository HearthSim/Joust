import * as React from "react";
import {EntityInPlayProps} from "../../interfaces";
import Attack from "./stats/Attack";
import Durability from "./stats/Durability";
import WeaponArt from "./visuals/WeaponArt";
import EntityInPlay from "./EntityInPlay";
import {GameTag} from "../../enums";

class Weapon extends EntityInPlay<EntityInPlayProps> {

	constructor() {
		super('weapon');
	}

	public jsx() {
		let entity = this.props.entity;
		let defaultAttack = null;
		let defaultDurability = null;
		if (this.props.cards && this.props.cards.has(entity.cardId)) {
			var data = this.props.cards.get(entity.cardId);
			defaultAttack = data.attack;
			defaultDurability = data.durability;
		}

		if (this.state.isHovering) {
			entity = entity.setTag(GameTag.EXHAUSTED, 0);
		}

		return [
			<WeaponArt
				key="art"
				entity={entity}
				cards={this.props.cards}
				assetDirectory={this.props.assetDirectory}
				cardArtDirectory={this.props.cardArtDirectory}
			/>,
			<div className="stats" key="stats">
				<Attack attack={entity.getAtk() } default={defaultAttack}/>
				<Durability durability={entity.getDurability() } damage={entity.getDamage() }
							default={defaultDurability}/>
			</div>,
		];
	}
}

export default Weapon;
