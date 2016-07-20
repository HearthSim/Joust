import * as React from "react";
import EntityInPlay from "./EntityInPlay";
import {EntityInPlayProps} from "../../interfaces";
import {GameTag, MetaDataType} from "../../enums";
import InPlayCardArt from "./visuals/InPlayCardArt";

import Attack from "./stats/Attack";
import Health from "./stats/Health";
import Damage from "./stats/Damage";
import Healing from "./stats/Healing";

import {CardData} from "../../interfaces";
import MetaData from "../../MetaData";
import GameStateDescriptor from "../../state/GameStateDescriptor";
import Card from "./Card";

class Minion extends EntityInPlay<EntityInPlayProps> {

	constructor() {
		super('minion');
	}

	public jsx() {
		let entity = this.props.entity;
		let cardId = entity.cardId;

		let data: CardData = {};
		if (this.props.cards && this.props.cards.has(cardId)) {
			data = this.props.cards.get(cardId);
		}

		var damage = 0;
		var healing = 0;

		if (this.props.descriptors) {
			this.props.descriptors.forEach((descriptor: GameStateDescriptor) => {
				descriptor.getMetaData().forEach((metaData: MetaData) => {
					if (metaData.getEntities().has(entity.id)) {
						switch(metaData.getType()) {
							case MetaDataType.DAMAGE:
								damage += metaData.getData();
								break;
							case MetaDataType.HEALING:
								healing += metaData.getData();
								break;
						}
					}
				})
			})
		}

		return [
			<InPlayCardArt key="art"
				entity={entity}
				controller={this.props.controller}
				cards={this.props.cards}
				assetDirectory={this.props.assetDirectory}
				cardArtDirectory={this.props.cardArtDirectory}
				damage={damage}
				healing={healing}
				/>,
			<div key="stats" className="stats">
				<Attack attack={entity.getAtk() } default={data.attack}/>
				<Health health={entity.getHealth() } damage={entity.getDamage()} default={data.health}/>
				{damage != 0 ? <Damage damage={damage}/> : null}
				{healing != 0 ? <Healing healing={healing}/> : null}
			</div>
		];
	}
}

export default Minion;
