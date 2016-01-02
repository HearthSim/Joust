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
import Weapon = require('./Weapon');
import Secrets = require('./Secrets');

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

		var playEntities = this.props.entities.get(1) || Immutable.Map<number, Entity>();

		/* Equipment */
		var hero = <Hero entity={playEntities.filter(filterByCardType(3)).first()}/>;
		var heroPower = <HeroPower entity={playEntities.filter(filterByCardType(10)).first()}/>;
		var weapon = <Weapon entity={playEntities.filter(filterByCardType(7)).first()}/>;

		var field = <Field entities={playEntities.filter(filterByCardType(4))}/>;
		var deck = <Deck entities={this.props.entities.get(2) || Immutable.Map<number, Entity>()}/>;
		var hand = <Hand entities={this.props.entities.get(3) || Immutable.Map<number, Entity>()}/>;
		var secrets = <Secrets entities={this.props.entities.get(7) || Immutable.Map<number, Entity>()}/>;

		var classNames = this.props.isTop ? 'player top' : 'player';

		if (this.props.isTop) {
			return (
				<div className={classNames}>
					{hand}
					<div className="equipment">
						{weapon}
						{hero}
						{heroPower}
						{deck}
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
						{weapon}
						{hero}
						{heroPower}
						{deck}
					</div>
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
