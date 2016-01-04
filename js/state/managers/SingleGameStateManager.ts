/// <reference path="../GameStateMutator.d.ts"/>
'use strict';

import {EventEmitter} from 'events';
import {GameStateManager} from "../../interfaces";
import GameState = require("../GameState");
import GameStateMutator = require("../GameStateMutator");

class SingleGameStateManager extends EventEmitter implements GameStateManager {
	protected complete:boolean = false;

	constructor(protected gameState:GameState) {
		super();
	}

	public setGameState(gameState:GameState):void {
		var previous = this.gameState;
		this.gameState = gameState;
		this.emit('gamestate', gameState, this.gameState);
	}

	public getGameState():GameState {
		return this.gameState;
	}

	public apply(mutator:GameStateMutator):void {
		var state = this.gameState.apply(mutator);
		this.setGameState(state);
	}

	public mark(timestamp:number):void {
		return;
	}

	public setComplete(complete:boolean):void {
		this.complete = true;
	}

	public isComplete():boolean {
		return this.complete;
	}
}

export = SingleGameStateManager;