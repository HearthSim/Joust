/// <reference path='../node_modules/immutable/dist/immutable.d.ts'/>

import * as React from 'react';
import Entity from './Entity';
import Option from './Option';
import GameStateMutator from "./state/GameStateMutator";
import GameState from "./state/GameState";
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
	optionCallback?(option:Option, target?:number, position?:number) : void;
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