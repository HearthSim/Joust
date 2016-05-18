import * as React from "react";

import EntityInPlay from "./EntityInPlay";
import {EntityInPlayProps, CardDataProps} from "../../interfaces";
import Entity from "../../Entity";
import Attack from "./stats/Attack";
import Health from "./stats/Health";
import Armor from "./stats/Armor";
import SecretText from "./stats/SecretText"
import HeroArt from "./visuals/HeroArt";
import * as _ from "lodash";

interface HeroProps extends EntityInPlayProps {
	secrets: Immutable.Map<number, Entity>;
}

class Hero extends EntityInPlay<HeroProps, {}> {
	constructor() {
		super('hero');
	}

	protected jsx() {
		var entity = this.props.entity;
		var secretCount = this.props.secrets.count();
		var secretText = secretCount > 1 ? secretCount.toString() : "?";

		return [
			<HeroArt key="art"
				entity={entity}
				secrets={this.props.secrets}
				cards={this.props.cards}
				assetDirectory={this.props.assetDirectory}
				cardArtDirectory={this.props.cardArtDirectory}
				/>,
			<div key="stats" className="stats">
				{entity.getAtk() ? <Attack attack={entity.getAtk() }/> : null}
				<Health health={entity.getHealth() } damage={entity.getDamage() }/>
				{entity.getArmor() ? <Armor armor={entity.getArmor() }/> : null}
				{secretCount > 0 ? <SecretText text={secretText} /> : null}
			</div>
		];
	}
}

export default _.flow(
	EntityInPlay.DragSource(),
	EntityInPlay.DropTarget()
)(Hero);
