import * as React from "react";
import EntityInPlay from "./EntityInPlay";
import {EntityInPlayProps} from "../../interfaces";
import {GameTag} from "../../enums";
import InPlayCardArt from "./visuals/InPlayCardArt";
import Card from "./Card";

import Attack from "./stats/Attack";
import Health from "./stats/Health";

import {DragSource, DropTarget} from "react-dnd";
import * as _ from "lodash";
import {CardData} from "../../interfaces";

class Minion extends EntityInPlay<EntityInPlayProps, {}> {

	constructor() {
		super('minion');
	}

	public jsx() {
		let entity = this.props.entity;
		let cardId = entity.getCardId();

		let data: CardData = {};
		if (this.props.cards && this.props.cards.has(cardId)) {
			data = this.props.cards.get(cardId);
		}

		return [
			<InPlayCardArt key="art"
				entity={entity}
				controller={this.props.controller}
				cards={this.props.cards}
				assetDirectory={this.props.assetDirectory}
				textureDirectory={this.props.textureDirectory}
				/>,
			<div key="stats" className="stats">
				<Attack attack={entity.getAtk() } default={data.attack}/>
				<Health health={entity.getHealth() } damage={entity.getDamage() } default={data.health}/>
			</div>,
			<div className="mouse-over">
				<Card entity={entity}
					  option={undefined}
					  assetDirectory={this.props.assetDirectory}
					  cards={this.props.cards}
					  isHidden={false}
					  controller={this.props.controller}
					  textureDirectory={this.props.textureDirectory}
					  defaultStats={true}
				/>
			</div>
		];
	}
}

export default _.flow(
	EntityInPlay.DragSource(),
	EntityInPlay.DropTarget()
)(Minion);
