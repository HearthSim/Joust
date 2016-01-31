/// <reference path="../../typings/react/react.d.ts"/>
/// <reference path="../../typings/react/react-addons-css-transition-group.d.ts"/>
/// <reference path="../../typings/react-dnd/react-dnd.d.ts"/>
import {EntityListProps} from "../interfaces";

import EntityInPlay from "./EntityInPlay";
import * as React from 'react';

import EntityList from './EntityList';
import Entity from '../Entity';
import Option from '../Option';
import Minion from './Minion';

import {EntityInPlayProps} from '../interfaces';

import {DropTarget} from 'react-dnd';

class Field extends EntityList {

	protected className():string {
		return 'field';
	}

	public render() {
		var elements = [];
		if (this.props.entities) {
			var entities = this.props.entities.toList().sortBy(function (entity) {
				return entity.getZonePosition();
			});
			entities.forEach(function (entity) {
				elements.push(<li
					key={entity.getId()}>{this.renderEntity(entity, this.props.options.get(entity.getId()))}</li>);
			}.bind(this));
		}
		return this.props.connectDropTarget(
			<ul className={this.className()}>
				{elements}
			</ul>
		);
	}

	protected renderEntity(entity:Entity, option:Option) {
		return (<Minion entity={entity} option={option} optionCallback={this.props.optionCallback}/>);
	}
}

export default DropTarget('card',
	{
		canDrop: function (props:EntityListProps, monitor) {
			var item = monitor.getItem();
			return !item.option.hasTargets();
		},
		drop: function (props:EntityListProps, monitor, component) {
			var item = monitor.getItem();
			item.action(item.option);
		}
	},
	function (connect, monitor) {
		return {
			connectDropTarget: connect.dropTarget(),
			isOver: monitor.isOver()
		};
	}
)(Field);