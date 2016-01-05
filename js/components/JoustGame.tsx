/// <reference path="../../typings/react/react.d.ts"/>
/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
/// <reference path="../../node_modules/immutable/dist/immutable.d.ts"/>
import {GameStateManager} from "../interfaces";
'use strict';

import React = require('react');
import TwoPlayerGame = require('./TwoPlayerGame');

import Entity = require('../Entity');
import Player = require('../Player');

import Option = require('../Option');
import GameState= require('../state/GameState');
import HSReplayDecoder = require('../protocol/HSReplayDecoder');
import KettleTranscoder = require('../protocol/KettleTranscoder');

import ClearOptionsMutator = require("../state/mutators/ClearOptionsMutator");

import HistoryGameStateManager = require("../state/managers/HistoryGameStateManager");

interface JoustGameProps extends React.Props<any> {
	manager: GameStateManager;
}

interface JoustState {
	gameState: GameState;
}

class JoustGame extends React.Component<JoustGameProps, JoustState> {

	public constructor() {
		super();
		this.state = {gameState: new GameState()};
	}

	public componentDidMount() {
		this.props.manager.on('gamestate', this.updateState.bind(this));
	}

	private start:number;

	public updateState(gameState) {
		this.setState({gameState: gameState});
	}

	protected optionCallback(option:Option, target?:number) {
		//this.kettle.sendOption(option, target);
		//this.manager.apply(new ClearOptionsMutator());
	}

	public render() {
		var allEntities = this.state.gameState.getEntities();
		var entityTree = this.state.gameState.getEntityTree();
		var options = this.state.gameState.getOptions();
		var optionTree = this.state.gameState.getOptionTree();

		var filterByCardType = function (cardType:number) {
			return function (entity:Entity):boolean {
				return !!entity && entity.getCardType() === cardType;
			};
		};

		// find the game entity
		var game = allEntities ? allEntities.filter(filterByCardType(1)).first() : null;
		if (!game) {
			return <p className="message">Loading game&hellip;</p>;
		}

		// find an end turn option
		var endTurnOption = options.filter(function (option:Option):boolean {
			return !!option && option.getType() === 2;
		}).first();

		// determine player count
		var players = allEntities.filter(filterByCardType(2)) as Immutable.Map<number, Player>;
		switch (players.count()) {
			case 0:
				return <p className="message">Loading players&hellip;</p>;
				break;
			case 2:
				return (
					<TwoPlayerGame entity={game} player1={players.first()}
								   player2={players.last()}
								   options={optionTree}
								   entities={entityTree}
								   endTurnOption={endTurnOption}
								   optionCallback={this.optionCallback.bind(this)}
					/>
				);
				break;
			default:
				return <p className="message">Unsupported player count: {players.size}.</p>;
		}
	}

	public shouldComponentUpdate(nextProps:JoustGameProps, nextState:JoustState) {
		return this.props.manager !== nextProps.manager ||
			this.state.gameState !== nextState.gameState;
	}

}

export = JoustGame;