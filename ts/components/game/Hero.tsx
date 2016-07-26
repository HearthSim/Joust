import * as React from "react";

import EntityInPlay from "./EntityInPlay";
import {EntityInPlayProps, CardOracleProps} from "../../interfaces";
import Entity from "../../Entity";
import Attack from "./stats/Attack";
import Damage from "./stats/Damage";
import Healing from "./stats/Healing";
import Health from "./stats/Health";
import Armor from "./stats/Armor";
import SecretText from "./stats/SecretText"
import HeroArt from "./visuals/HeroArt";
import {MetaDataType} from "../../enums";
import MetaData from "../../MetaData";
import GameStateDescriptor from "../../state/GameStateDescriptor";

interface HeroProps extends EntityInPlayProps, CardOracleProps {
	secrets: Immutable.Map<number, Entity>;
}

class Hero extends EntityInPlay<HeroProps> {
	constructor() {
		super('hero');
	}

	protected jsx() {
		var entity = this.props.entity;

		var secretCount = this.props.secrets.count();
		var secretText = secretCount > 1 ? secretCount.toString() : "?";
		var secretTitle = this.props.secrets.reduce((title, entity: Entity): string => {
			let name = entity.cardId;
			if(!entity.isRevealed()) {
				if(this.props.cardOracle && this.props.cardOracle.has(entity.id)) {
					name = this.props.cardOracle.get(entity.id);
				}
				else {
					return title;
				}
			}
			if(title) {
				title += ", ";
			}
			if(this.props.cards && this.props.cards.has(name)) {
				name = this.props.cards.get(name).name || name;
			}
			return title += name;
		}, "");

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
			<HeroArt key="art"
				entity={entity}
				secrets={this.props.secrets}
				cards={this.props.cards}
				assetDirectory={this.props.assetDirectory}
				cardArtDirectory={this.props.cardArtDirectory}
				damage={damage}
				healing={healing}
				/>,
			<div key="stats" className="stats">
				{entity.getAtk() ? <Attack attack={entity.getAtk()}/> : null}
				<Health health={entity.getHealth() } damage={entity.getDamage()}/>
				{entity.getArmor() ? <Armor armor={entity.getArmor()}/> : null}
				{secretCount > 0 ? <SecretText text={secretText} title={secretTitle}/> : null}
				{damage != 0 ? <Damage damage={damage}/> : null}
				{healing != 0 ? <Healing healing={healing}/> : null}
			</div>
		];
	}
}

export default Hero;
