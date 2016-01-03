/// <reference path="../../typings/react/react.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
'use strict';

import React = require('react');

import {EntityProps, OptionProps} from "../interfaces";
import Entity = require('../Entity');
import Secrets = require('./Secrets');
import Attack = require('./stats/Attack')
import Health = require('./stats/Health')

interface HeroProps extends EntityProps, OptionProps, React.Props<any> {
	secrets: Immutable.Map<number, Entity>;
}

class Hero extends React.Component<HeroProps, {}> {
	public render() {
		if (!this.props.entity) {
			return <div className="hero no-entity"></div>;
		}

		var entity = this.props.entity;

		var classNames = this.props.option ? 'hero playable' : 'hero';
		var health = null;
		var attack = entity.getAtk() ? <Attack attack={entity.getAtk()}/> : null;
		return (
			<div className={classNames}>
				<Secrets entities={this.props.secrets}/>
				<div className="stats">
					{attack}
					<Health health={entity.getHealth()} damage={entity.getDamage()}/>
				</div>
			</div>
		);
	}

	public shouldComponentUpdate(nextProps:HeroProps, nextState) {
		return (
			this.props.entity !== nextProps.entity ||
			this.props.option !== nextProps.option ||
			this.props.secrets !== nextProps.secrets
		);
	}
}

export = Hero;
