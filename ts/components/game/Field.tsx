import * as React from "react";
import EntityInPlay from "./EntityInPlay";
import EntityList from "./EntityList";
import Entity from "../../Entity";
import Option from "../../Option";
import Minion from "./Minion";

import {EntityInPlayProps, EntityListProps} from "../../interfaces";

export default class Field extends EntityList<EntityListProps> {

	protected className(): string {
		return 'field';
	}

	protected renderEntity(entity: Entity, option: Option) {
		return (<Minion entity={entity}
			option={option}
			optionCallback={this.props.optionCallback}
			assetDirectory={this.props.assetDirectory}
			cardArtDirectory={this.props.cardArtDirectory}
			cards={this.props.cards}
			controller={this.props.controller}
			descriptors={this.props.descriptors}
			buffed={entity && this.props.buffedEntities && this.props.buffedEntities.indexOf(entity.id) !== -1}
			/>);
	}
}
