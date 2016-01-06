/// <reference path="../../../node_modules/immutable/dist/immutable.d.ts"/>
/// <reference path="../GameStateMutator.d.ts"/>
'use strict';

import Immutable = require('immutable');
import {GameStateManager} from "../../interfaces";
import GameState = require('../GameState');
import Entity = require('../../Entity');
import Option = require('../../Option');
import GameStateMutator = require('../GameStateMutator');
import SingleGameStateManager = require("./SingleGameStateManager");

class HistoryGameStateManager extends SingleGameStateManager {

	protected complete:boolean = false;
	private history:Immutable.Map<number, GameState>;

	constructor(protected gameState:GameState) {
		super(gameState);
		this.history = Immutable.Map<number, GameState>();
	}

	public mark(timestamp:number):void {
		if (this.history.has(timestamp)) {
			return;
		}
		this.history = this.history.set(timestamp, this.gameState);
		this.emit('mark', timestamp);
		//console.log('Mark at ' + (timestamp / 1000) + ' (now at ' + this.history.size + ')');
	}

	public getHistory():Immutable.Map<number, GameState> {
		return this.history;
	}
}

export = HistoryGameStateManager;