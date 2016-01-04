/// <reference path="../GameStateMutator.d.ts"/>
'use strict';

import {GameStateManager} from "../../interfaces";
import GameState = require("../GameState");
import GameStateMutator = require("../GameStateMutator");

class SingleGameStateManager implements GameStateManager {
	protected complete:boolean = false;

	constructor(protected gameState:GameState) {
	}

	setGameState(gameState:GameState):void {
		this.gameState = gameState;
	}

	getGameState():GameState {
		return undefined;
	}

	apply(mutator:GameStateMutator):void {
		this.gameState.apply(mutator);
	}

	mark(timestamp:number):void {
		return;
	}

	setComplete(complete:boolean):void {
		this.complete = true;
	}

	isComplete():boolean {
		return this.complete;
	}
}

export = SingleGameStateManager;