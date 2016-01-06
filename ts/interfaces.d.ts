/// <reference path='../node_modules/immutable/dist/immutable.d.ts'/>

import React = require('react');
import Entity = require('./Entity');
import Option = require('./Option');
import GameStateMutator = require("./state/GameStateMutator");
import GameState = require("./state/GameState");
import {EventEmitter} from 'events';

export interface DropTargetProps {
	connectDropTarget?(jsx);
	isOver?;
}

export interface DragSourceProps {
	connectDragSource?(jsx);
}

export interface EntityInPlayProps extends EntityProps, OptionProps, DragSourceProps, DropTargetProps, React.Props<any> {
	isTarget:boolean;
}

export interface EntityListProps extends OptionCallbackProps, DropTargetProps {
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

export interface Client extends EventEmitter {
	connect():void;
	disconnect():void;
	write(buffer:Buffer):void;
}