import * as React from "react";

import EntityList from "./EntityList";
import Entity from "../../Entity";
import Option from "../../Option";
import Card from "./Card";
import {GameTag} from "../../enums";
import {CardType} from "../../enums";
import {EntityListProps} from "../../interfaces";

export default class Hand extends EntityList<EntityListProps> {

	protected className(): string {
		return 'hand';
	}

	protected totalEntities: number;

	protected beforeRender(entities: number) {
		this.totalEntities = entities;
	}

	protected renderEntity(entity: Entity, option: Option, index?: number) {

		let style = {};

		/*if (typeof index === 'number' && this.totalEntities > 0) {
		 let total = this.totalEntities * 1 + 10;
		 let deg = index * (total / (this.totalEntities - 1)) - total / 2;
		 let px = (total - Math.abs(deg));

		 style['transform'] = 'rotate(' + deg + 'deg) translateY(' + '-' + px + '%)';
		 }*/

		let wasHidden = false;

		if (this.props.hideCards) {
			entity = new Entity(entity.id, entity.getTags());
		}
		else if (!entity.cardId && this.props.cardOracle && this.props.cardOracle.has(+entity.id)) {
			let cardId = this.props.cardOracle.get(entity.id);
			entity = new Entity(entity.id, entity.getTags(), cardId);
			wasHidden = true;
		}

		return (<Card entity={entity}
			option={option}
			style={style}
			optionCallback={this.props.optionCallback}
			assetDirectory={this.props.assetDirectory}
			cards={this.props.cards}
			isHidden={wasHidden}
			controller={this.props.controller}
			cardArtDirectory={this.props.cardArtDirectory}
			/>);
	}
}
