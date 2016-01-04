/// <reference path='../node_modules/immutable/dist/immutable.d.ts'/>

import Entity = require('./Entity');
import Option = require('./Option');
import GameStateMutator = require("./state/GameStateMutator");
import GameState = require("./state/GameState");
import {EventEmitter} from 'events';

export interface EntityListProps extends OptionCallbackProps {
	entities: Immutable.Iterable<number, Entity>;
	options?: Immutable.Iterable<number, Option>;
}

export interface EntityProps {
	entity: Entity;
}

export interface OptionCallbackProps {
	optionCallback?(option:Option, target?:number) : void;
}

export interface OptionProps extends OptionCallbackProps {
	option: Option;

}

export interface GameStateManager extends EventEmitter {
	setGameState(gameState:GameState) : void;
	getGameState() : GameState;
	apply(mutator:GameStateMutator) : void;
	mark(timestamp:number) : void;
	setComplete(complete:boolean) : void;
	isComplete() : boolean;
}