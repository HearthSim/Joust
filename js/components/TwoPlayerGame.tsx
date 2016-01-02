/// <reference path="../../typings/react/react-global.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
'use strict';

import {EntityProps} from "../interfaces";
import Entity = require('../Entity');
import Player = require('./Player');
import PlayerEntity = require('../Player');
import EndTurnButton = require('./EndTurnButton');

interface TwoPlayerGameProps extends EntityProps, React.Props<any> {
	player1: PlayerEntity;
	player2: PlayerEntity;
	entities: Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Entity>>>;
}

class TwoPlayerGame extends React.Component<TwoPlayerGameProps, {}> {

	public render() {
		var entities = this.props.entities;
		var player1 = this.props.player1 as PlayerEntity;
		var player2 = this.props.player2 as PlayerEntity;

		var emptyEntities = Immutable.Map<number, Immutable.Map<number, Entity>>();
		return (
			<div className="game">
				<Player player={player1 as PlayerEntity} isTop={true} entities={entities.get(player1.getPlayerId()) || emptyEntities}/>
				<EndTurnButton/>
				<Player player={player2 as PlayerEntity} isTop={false} entities={entities.get(player2.getPlayerId()) || emptyEntities}/>
			</div>
		);
	}

	public shouldComponentUpdate(nextProps:TwoPlayerGameProps, nextState) {
		return (
			this.props.entity !== nextProps.entity ||
			this.props.player1 !== nextProps.player1 ||
			this.props.player2 !== nextProps.player2 ||
			this.props.entities !== nextProps.entities
		);
	}
}

export = TwoPlayerGame;