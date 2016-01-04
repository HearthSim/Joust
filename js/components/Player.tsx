/// <reference path="../../typings/react/react.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
import {OptionCallbackProps} from "../interfaces";
'use strict';

import React = require('react');

import Immutable = require('immutable');
import PlayerEntity = require('../Player');
import Entity = require('../Entity');
import Option = require('../Option');
import EntityList = require('./EntityList');
import Deck = require('./Deck');
import Hand = require('./Hand');
import Hero = require('./Hero');
import HeroPower = require('./HeroPower');
import Field = require('./Field');
import Weapon = require('./Weapon');
import Secrets = require('./Secrets');

interface PlayerProps extends OptionCallbackProps, React.Props<any> {
	player: PlayerEntity;
	entities: Immutable.Map<number, Immutable.Map<number, Entity>>;
	options: Immutable.Map<number, Immutable.Map<number, Option>>;
	isTop: boolean;
}

class Player extends React.Component<PlayerProps, {}> {

	public render() {
		var filterByCardType = function (cardType:number) {
			return function (entity:Entity):boolean {
				return !!entity && entity.getCardType() === cardType;
			};
		};

		var emptyEntities = Immutable.Map<number, Entity>();
		var emptyOptions = Immutable.Map<number, Option>();

		var playEntities = this.props.entities.get(1) || Immutable.Map<number, Entity>();
		var playOptions = this.props.options.get(1) || Immutable.Map<number, Option>();

		/* Equipment */
		var heroEntity = playEntities.filter(filterByCardType(3)).first();
		var hero = <Hero entity={heroEntity}
						 option={heroEntity ? playOptions.get(heroEntity.getId()) : null}
						 secrets={this.props.entities.get(7) || Immutable.Map<number, Entity>()}/>;
		var heroPowerEntity = playEntities.filter(filterByCardType(10)).first();
		var heroPower = <HeroPower entity={heroPowerEntity}
								   option={heroPowerEntity ? playOptions.get(heroPowerEntity.getId()) : null}
								   optionCallback={this.props.optionCallback}/>;
		var weapon = <Weapon entity={playEntities.filter(filterByCardType(7)).first()}/>;

		var field = <Field entities={playEntities.filter(filterByCardType(4)) || emptyEntities}
						   options={playOptions || emptyOptions}/>;
		var deck = <Deck entities={this.props.entities.get(2) || emptyEntities}
						 options={this.props.options.get(2) || emptyOptions}/>;
		var hand = <Hand entities={this.props.entities.get(3) || emptyEntities}
						 options={this.props.options.get(3) || emptyOptions}
						 optionCallback={this.props.optionCallback}/>;
		var name = this.props.player.getName() ? <div className="name">{this.props.player.getName()}</div> : null;

		var classNames = this.props.isTop ? 'player top' : 'player';

		if (this.props.isTop) {
			return (
				<div className={classNames}>
					{hand}
					<div className="equipment">
						<div>
							{name}
						</div>
						<div className="middle">
							{weapon}
							{hero}
							{heroPower}
						</div>
						<div>
							{deck}
						</div>
					</div>
					{field}
				</div>
			);
		}
		else {
			return (
				<div className={classNames}>
					{field}
					<div className="equipment">
						<div>
							{name}
						</div>
						<div className="middle">
							{weapon}
							{hero}
							{heroPower}
						</div>
						<div>
							{deck}
						</div>
					</div>
					{hand}
				</div>
			);
		}
	}

	public shouldComponentUpdate(nextProps:PlayerProps, nextState) {
		return (
			this.props.player !== nextProps.player ||
			this.props.entities !== nextProps.entities ||
			this.props.options !== nextProps.options ||
			this.props.optionCallback !== nextProps.optionCallback
		);
	}
}

export = Player;
