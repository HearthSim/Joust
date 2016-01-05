import GameStateMutator = require("./GameStateMutator");
'use strict';

import GameState = require("./GameState");
import {GameStateManager} from "../interfaces";
import {EventEmitter} from 'events';
import HistoryGameStateManager = require("./managers/HistoryGameStateManager");

class GameStateScrubber extends EventEmitter implements GameStateManager {
	protected latestState:GameState = new GameState();
	protected start:number = null;

	constructor(protected manager:HistoryGameStateManager) {
		super();
	}

	setGameState(gameState:GameState):void {
		if (gameState === this.latestState) {
			return;
		}
		var previous = this.latestState;
		this.latestState = gameState;
		this.emit('gamestate', gameState, previous);
		return;
	}

	getGameState():GameState {
		return this.latestState;
	}

	apply(mutator:GameStateMutator):void {
		return;
	}

	mark(timestamp:number):void {
		return;
	}

	setComplete(complete:boolean):void {
		return;
	}

	isComplete():boolean {
		return false;
	}

	public play() {
		setInterval(this.updateState.bind(this), 100);
		this.start = new Date().getTime();
		this.updateState();
	}

	protected updateState() {
		var history = this.manager.getHistory();
		var latest = null;
		var timeInGame = new Date().getTime() - this.start;
		history.forEach(function (value, time) {
			if (timeInGame >= +time / 2 && (latest === null || time > latest)) {
				latest = time;
			}
		});
		if (latest && history.has(latest)) {
			this.setGameState(history.get(latest));
		}
	}
}

export = GameStateScrubber;