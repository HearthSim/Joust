/// <reference path="../GameStateMutator.d.ts"/>

import {EventEmitter} from 'events';
import {GameStateManager} from "../../interfaces";
import GameState from "../GameState";
import GameStateMutator from "../GameStateMutator";

class SingleGameStateManager extends EventEmitter implements GameStateManager {
	protected complete:boolean = false;

	constructor(protected gameState:GameState) {
		super();
	}

	public setGameState(gameState:GameState):void {
		if (this.complete) {
			return;
		}
		var previous = this.gameState;
		this.gameState = gameState;
		this.emit('gamestate', gameState, previous);
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
		this.complete = complete;
		if (complete) {
			this.emit('end');
		}
	}

	public isComplete():boolean {
		return this.complete;
	}
}

export default SingleGameStateManager;