/// <reference path="../../typings/react/react.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
'use strict';

import React = require('react');

import {EntityListProps} from "../interfaces";
import Entity = require('../Entity');
import Option = require('../Option');

class EntityList extends React.Component<EntityListProps, {}> {

	protected renderEntity(entity:Entity, option:Option) {
		var id = entity.getCardId() ? (' (CardID=' + entity.getCardId() + ')') : '';
		return (<span>Entity #{entity.getId()}{id}</span>);
	}

	protected className():string {
		return 'entityList';
	}

	public render() {
		var elements = [];
		if (this.props.entities) {
			var entities = this.props.entities.toList().sortBy(function (entity) {
				return entity.getZonePosition();
			});
			entities.forEach(function (entity) {
				var option = this.props.options ? this.props.options.get(entity.getId()) : null;
				elements.push(
					<li key={entity.getId()}>
						{this.renderEntity(entity, option)}
					</li>);
			}.bind(this));
		}
		return (
			<ul className={this.className()}>
				{elements}
			</ul>
		);
	}

	public shouldComponentUpdate(nextProps:EntityListProps, nextState) {
		return (
			this.props.entities !== nextProps.entities ||
			this.props.options !== nextProps.options
		);
	}
}

export = EntityList;