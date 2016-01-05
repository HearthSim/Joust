import GameStateMutator = require("./GameStateMutator");
'use strict';

import GameState = require("./GameState");
import {GameStateManager} from "../interfaces";
import {EventEmitter} from 'events';
import HistoryGameStateManager = require("./managers/HistoryGameStateManager");

class GameStateScrubber extends EventEmitter implements GameStateManager {
	protected latestState:GameState = new GameState();
	protected start:number = null;
	protected interval:number = null;

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
		this.on('end', this.pause.bind(this));
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
		if(complete) {
			this.emit('end');
		}
	}

	isComplete():boolean {
		return false;
	}

	public play() {
		this.interval = setInterval(this.updateState.bind(this), 100);
		this.start = new Date().getTime();
		this.updateState();
	}

	public pause() {
		if(this.interval !== null) {
			clearInterval(this.interval);
			this.interval = null;
		}
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