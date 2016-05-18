import * as React from "react";

import EntityList from "./EntityList";
import Entity from "../../Entity";
import Option from "../../Option";
import Card from "./Card";
import {GameTag} from "../../enums";
import {CardType} from "../../enums";
import {EntityListProps} from "../../interfaces";
import Choice from "../../Choice";

interface ChoicesProps extends EntityListProps {
	isMulligan: boolean;
	choices: Immutable.Map<number, Choice>;
}

class Choices extends EntityList<ChoicesProps> {

	protected className(): string {
		return 'choices';
	}

	protected sort(entity: Entity): number {
		return this.props.choices.get(entity.getId()).getIndex();
	}

	protected renderEntity(entity: Entity, option: Option, index?: number) {
		var hidden = false;
		if (!entity.getCardId() && this.props.cardOracle && this.props.cardOracle.has(+entity.getId())) {
			let cardId = this.props.cardOracle.get(entity.getId());
			entity = new Entity(entity.getId(), entity.getTags(), cardId);
			hidden = true;
		}

		if(this.props.isMulligan && entity.getCardId() === 'GAME_005') {
			return null;
		}

		return (<Card entity={entity}
			option={option}
			optionCallback={this.props.optionCallback}
			assetDirectory={this.props.assetDirectory}
			cards={this.props.cards}
			isHidden={hidden}
			controller={this.props.controller}
			cardArtDirectory={this.props.cardArtDirectory}
			/>);
	}
}

export default Choices;
