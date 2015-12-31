/// <reference path="../../typings/react/react-global.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
'use strict';

import {EntityListProps} from "../interfaces";

class EntityList extends React.Component<EntityListProps, {}> {

	public render() {
		var elements = [];
		if (this.props.entities) {
			var entities = this.props.entities.sortBy(function (entity) {
				return entity.getZonePosition();
			});
			entities.forEach(function (entity) {
				var id = entity.getCardId() ? (' (CardID=' + entity.getCardId() + ')') : '';
				elements.push(<li key={entity.getId()}>Entity #{entity.getId()}{id}</li>);
			});
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