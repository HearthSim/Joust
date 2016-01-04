/// <reference path="../../typings/react/react.d.ts"/>
/// <reference path="../../typings/react/react-addons-css-transition-group.d.ts"/>
'use strict';

import React = require('react');
import CSSTransitionGroup = require('react-addons-css-transition-group');

import EntityList = require('./EntityList');
import Entity = require('../Entity');
import Option = require('../Option');
import Minion = require('./Minion');

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
				elements.push(<li key={entity.getId()}>{this.renderEntity(entity, this.props.options.get(entity.getId()))}</li>);
			}.bind(this));
		}
		return (
			<CSSTransitionGroup component="ul" className={this.className()}
									 transitionName="field-animation" transitionEnterTimeout={500}
									 transitionLeaveTimeout={500}
			>
				{elements}
			</CSSTransitionGroup>
		);
	}

	protected renderEntity(entity:Entity, option:Option) {
		return (<Minion entity={entity} option={option}/>);
	}
}

export = Field;
