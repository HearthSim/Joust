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

import HearthstoneJSON = require('../metadata/HearthstoneJSON');
import HistoryGameStateManager = require("../state/managers/HistoryGameStateManager");

interface JoustState {
	gameState: GameState;
}

class Joust extends React.Component<{}, JoustState> {
	public constructor(props) {
		super(props);
		this.state = {
			gameState: new GameState(
				Immutable.Map<number, Entity>(),
				Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Entity>>>(),
				Immutable.Map<number, Option>()
			)
		};
	}

	private kettle:KettleTranscoder;
	private manager:HistoryGameStateManager;

	public componentDidMount() {
		var initialState = new GameState();
		var tracker = new HistoryGameStateManager(initialState);
		this.manager = tracker;

		var hsreplay = new HSReplayDecoder(tracker);
		hsreplay.parse('sample.hsreplay');
		this.start = new Date().getTime();

		/*var kettle = new KettleTranscoder(manager);
		 kettle.connect(9111, 'localhost');
		 this.kettle = kettle;*/

		setInterval(this.updateState.bind(this), 100);

		HearthstoneJSON.fetch();
	}

	private start:number = 0;

	public updateState() {
		var history = this.manager.getHistory();
		var latest = null;
		var timeInGame = new Date().getTime() - this.start;
		history.forEach(function (value, time) {
			if (timeInGame >= +time / 8 && (latest === null || time > latest)) {
				latest = time;
			}
		});
		if (latest && history.has(latest)) {
			this.setState({gameState: history.get(latest)});
		}
		//this.setState({gameState: this.manager.getGameState()});
	}

	protected buildOptionTree(options:Immutable.Map<number, Option>, entities:Immutable.Map<number, Entity>):Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Option>>> {
		var optionTree = Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Option>>>();
		optionTree = optionTree.withMutations(function (map) {
			options.forEach(function (option:Option) {
				if (!option.getEntity()) {
					return;
				}
				var entity = entities.get(option.getEntity());
				map = map.setIn([entity.getController(), entity.getZone(), entity.getId()], option);
			});
		});

		return optionTree;
	}

	protected optionCallback(option:Option, target?:number) {
		//this.kettle.sendOption(option, target);
		//this.manager.apply(new ClearOptionsMutator());
	}

	public render() {
		var allEntities = this.state.gameState.getEntities();
		var entityTree = this.state.gameState.getEntityTree();
		var options = this.state.gameState.getOptions();
		var optionTree = this.buildOptionTree(options, allEntities);

		var filterByCardType = function (cardType:number) {
			return function (entity:Entity):boolean {
				return !!entity && entity.getCardType() === cardType;
			};
		};

		// find the game entity
		var game = allEntities ? allEntities.filter(filterByCardType(1)).first() : null;
		if (!game) {
			return <p>Awaiting Game Entity.</p>;
		}

		// find an end turn option
		var endTurnOption = options.filter(function (option:Option):boolean {
			return !!option && option.getType() === 2;
		}).first();

		// determine player count
		var players = allEntities.filter(filterByCardType(2)) as Immutable.Map<number, Player>;
		switch (players.count()) {
			case 0:
				return <p>Awaiting Player entities.</p>;
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
				return <p>Unsupported player count: {players.size}.</p>;
		}
	}

	public shouldComponentUpdate(nextProps, nextState:JoustState) {
		return this.state.gameState !== nextState.gameState;
	}

}

export = Joust;