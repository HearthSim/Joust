/// <reference path="../../typings/react/react.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
'use strict';

import React = require('react');

import {EntityProps} from "../interfaces";
import Entity = require('../Entity');
import Player = require('./Player');
import Option = require('../Option');
import PlayerEntity = require('../Player');
import EndTurnButton = require('./EndTurnButton');

interface TwoPlayerGameProps extends EntityProps, React.Props<any> {
	player1: PlayerEntity;
	player2: PlayerEntity;
	entities: Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Entity>>>;
	options: Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Option>>>;
	endTurnOption?: Option;
	endTurnCallback?;
}

class TwoPlayerGame extends React.Component<TwoPlayerGameProps, {}> {

	public render() {
		var entities = this.props.entities;
		var options = this.props.options;
		var player1 = this.props.player1 as PlayerEntity;
		var player2 = this.props.player2 as PlayerEntity;

		var emptyEntities = Immutable.Map<number, Immutable.Map<number, Entity>>();
		var emptyOptions = Immutable.Map<number, Immutable.Map<number, Option>>();
		return (
			<div className="game">
				<Player player={player1 as PlayerEntity} isTop={true}
						entities={entities.get(player1.getPlayerId()) || emptyEntities}
						options={options.get(player1.getPlayerId()) || emptyOptions}
				/>
				<EndTurnButton option={this.props.endTurnOption}
							   callback={this.props.endTurnCallback} onlyOption={options.count() === 0}/>
				<Player player={player2 as PlayerEntity} isTop={false}
						entities={entities.get(player2.getPlayerId()) || emptyEntities}
						options={options.get(player2.getPlayerId()) || emptyOptions}
				/>
			</div>
		);
	}

	public shouldComponentUpdate(nextProps:TwoPlayerGameProps, nextState) {
		return (
			this.props.entity !== nextProps.entity ||
			this.props.player1 !== nextProps.player1 ||
			this.props.player2 !== nextProps.player2 ||
			this.props.entities !== nextProps.entities ||
			this.props.options !== nextProps.options ||
			this.props.endTurnCallback !== nextProps.endTurnCallback
		);
	}
}

export = TwoPlayerGame;