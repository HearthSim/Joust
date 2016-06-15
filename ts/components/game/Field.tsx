import * as React from "react";
import EntityInPlay from "./EntityInPlay";
import EntityList from "./EntityList";
import Entity from "../../Entity";
import Option from "../../Option";
import Minion from "./Minion";

import {EntityInPlayProps, EntityListProps} from "../../interfaces";

import {DropTarget} from "react-dnd";

class Field extends EntityList<EntityListProps> {

	protected className(): string {
		return 'field';
	}

	public render(): JSX.Element {
		return this.props.connectDropTarget(
			super.render()
		);
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
			/>);
	}
}

export default DropTarget('card',
	{
		canDrop: function(props: EntityListProps, monitor) {
			var item = monitor.getItem();
			return !item.option.hasTargets();
		},
		drop: function(props: EntityListProps, monitor, component) {
			var item = monitor.getItem();
			item.action(item.option, undefined, 0);
		}
	},
	function(connect, monitor) {
		return {
			connectDropTarget: connect.dropTarget(),
			isOver: monitor.isOver()
		};
	}
)(Field);
