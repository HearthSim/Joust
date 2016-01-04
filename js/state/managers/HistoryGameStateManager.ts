/// <reference path="../../../node_modules/immutable/dist/immutable.d.ts"/>
/// <reference path="../GameStateMutator.d.ts"/>
'use strict';

import {GameStateManager} from "../../interfaces";
import GameState = require('../GameState');
import Entity = require('../../Entity');
import Option = require('../../Option');
import GameStateMutator = require('../GameStateMutator');

class HistoryGameStateManager implements GameStateManager {

	protected complete:boolean = false;
	private history:Immutable.Map<number, GameState>;

	constructor(private gameState?:GameState) {
		if (!gameState) {
			this.gameState = new GameState(
				Immutable.Map<number, Entity>(),
				Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Entity>>>(),
				Immutable.Map<number, Option>()
			);
		}
		this.history = Immutable.Map<number, GameState>();
	}

	public setGameState(gameState:GameState):void {
		this.gameState = gameState;
	}

	public getGameState():GameState {
		return this.gameState;
	}

	public apply(mutator:GameStateMutator):void {
		this.gameState = this.gameState.apply(mutator);
	}

	public mark(timestamp:number):void {
		if (this.history.has(timestamp)) {
			return;
		}
		this.history = this.history.set(timestamp, this.gameState);
		//console.log('Mark at ' + (timestamp / 1000) + ' (now at ' + this.history.size + ')');
	}

	public setComplete(complete):void {
		this.complete = complete;
	}

	public isComplete():boolean {
		return this.complete;
	}

	public getHistory():Immutable.Map<number, GameState> {
		return this.history;
	}
}

export = HistoryGameStateManager;