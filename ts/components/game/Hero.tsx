import * as React from "react";

import EntityInPlay from './EntityInPlay';
import {EntityInPlayProps, CardDataProps} from "../../interfaces";
import Entity from "../../Entity";
import Secrets from './Secrets';
import Attack from './stats/Attack'
import Health from './stats/Health'
import Armor from './stats/Armor'
import HeroArt from './visuals/HeroArt'
import * as _ from 'lodash';

interface HeroProps extends EntityInPlayProps {
	secrets: Immutable.Map<number, Entity>;
}

class Hero extends EntityInPlay<HeroProps, {}> {
	constructor() {
		super('hero');
	}

	protected jsx() {
		var entity = this.props.entity;

		return [
			<HeroArt entity={entity}
					 cards={this.props.cards}
					 assetDirectory={this.props.assetDirectory}
					 textureDirectory={this.props.textureDirectory}
			/>,
			<Secrets entities={this.props.secrets}
					 cards={this.props.cards}
					 assetDirectory={this.props.assetDirectory}
					 textureDirectory={this.props.textureDirectory}
			/>,
			<div className="stats">
				{entity.getAtk() ? <Attack attack={entity.getAtk()}/> : null}
				<Health health={entity.getHealth()} damage={entity.getDamage()}/>
				{entity.getArmor() ? <Armor armor={entity.getArmor()}/> : null}
			</div>
		];
	}
}

export default _.flow(
	EntityInPlay.DragSource(),
	EntityInPlay.DropTarget()
)(Hero);
