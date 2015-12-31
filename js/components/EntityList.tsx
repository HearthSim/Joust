/// <reference path="../../typings/react/react-global.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
'use strict';

import {EntityListProps} from "../interfaces";
import Entity = require('../Entity');

class EntityList extends React.Component<EntityListProps, {}> {

	protected renderEntity(entity:Entity) {
		var id = entity.getCardId() ? (' (CardID=' + entity.getCardId() + ')') : '';
		return (<span>Entity #{entity.getId()}{id}</span>);
	}

	public render() {
		var elements = [];
		if (this.props.entities) {
			var entities = this.props.entities.toList().sortBy(function (entity) {
				return entity.getZonePosition();
			});
			entities.forEach(function (entity) {
				elements.push(<li key={entity.getId()}>{this.renderEntity(entity)}</li>);
			}.bind(this));
		}
		return (
			<ul>
				{elements}
			</ul>
		);
	}

	public shouldComponentUpdate(nextProps:EntityListProps, nextState) {
		return (
			this.props.entities !== nextProps.entities
		);
	}
}

export = EntityList;