/// <reference path="../../typings/react/react-global.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
'use strict';

import PlayerEntity = require('../Player');
import Entity = require('../Entity');
import EntityList = require('./EntityList');
import Deck = require('./Deck');
import Hand = require('./Hand');
import Hero = require('./Hero');
import HeroPower = require('./HeroPower');
import Field = require('./Field');

interface PlayerProps extends React.Props<any> {
	player: PlayerEntity;
	entities: Immutable.Map<number, Immutable.Map<number, Entity>>;
	isTop: boolean;
}

class Player extends React.Component<PlayerProps, {}> {

	public render() {
		var filterByCardType = function (cardType:number) {
			return function (entity:Entity):boolean {
				return !!entity && entity.getCardType() === cardType;
			};
		};

		var hero = <Hero entity={this.props.entities.get(1).filter(filterByCardType(3)).first()}/>;
		var heroPower = <HeroPower entity={this.props.entities.get(1).filter(filterByCardType(10)).first()}/>;
		var field = <Field entities={this.props.entities.get(1).filter(filterByCardType(4))}/>;
		var deck = <Deck entities={this.props.entities.get(2)}/>;
		var hand = <Hand entities={this.props.entities.get(3)}/>;
		var secrets = <EntityList entities={this.props.entities.get(7)}/>;

		if (this.props.isTop) {
			return (
				<div>
					{hand}
					{deck}
					{secrets}
					{hero}
					{heroPower}
					{field}
				</div>
			);
		}
		else {
			return (
				<div>
					{field}
					{deck}
					{secrets}
					{hero}
					{heroPower}
					{hand}
				</div>
			);
		}
	}

	public shouldComponentUpdate(nextProps:PlayerProps, nextState) {
		return (
			this.props.player !== nextProps.player ||
			this.props.entities !== nextProps.entities
		);
	}
}

export = Player;
