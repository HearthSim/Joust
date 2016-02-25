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

		var title = this.props.entity.getCardId();
		if (this.props.cards && this.props.cards.has(this.props.entity.getCardId())) {
			var data = this.props.cards.get(this.props.entity.getCardId());
			var title = '' + data.name;
		}

		var classNames = this.props.option ? 'hero playable' : 'hero';
		var health = null;
		var attack = entity.getAtk() ? <Attack attack={entity.getAtk()}/> : null;
		var armor = entity.getArmor() ? <Armor armor={entity.getArmor()}/> : null;
		return (
			<div>
				<HeroArt entity={this.props.entity}/>
				<Secrets entities={this.props.secrets} cards={this.props.cards}/>
				<div className="stats">
					{attack}
					<Health health={entity.getHealth()} damage={entity.getDamage()}/>
					{armor}
				</div>
			</div>
		);
	}
}

export default _.flow(
	EntityInPlay.DragSource(),
	EntityInPlay.DropTarget()
)(Hero);
