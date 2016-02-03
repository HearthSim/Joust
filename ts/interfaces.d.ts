import * as React from 'react';
import Entity from './Entity';
import Option from './Option';
import GameStateMutator from "./state/GameStateMutator";
import GameState from "./state/GameState";
import {EventEmitter} from 'events';
import * as Stream from "stream";

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

export interface EntityListProps extends OptionCallbackProps, DropTargetProps, CardDataProps, React.Props<any> {
	entities: Immutable.Iterable<number, Entity>;
	options?: Immutable.Iterable<number, Option>;
	isTop?: boolean;
}

export interface EntityProps extends CardDataProps {
	entity: Entity;
}

export interface OptionCallbackProps {
	optionCallback?(option:Option, target?:number, position?:number) : void;
}

export interface OptionProps extends OptionCallbackProps {
	option: Option;
}

export interface JoustClient {
	isInteractive():boolean;
}

export interface ActionHandler {
	sendOption(option:Option):void;
}

export interface KettleClient extends EventEmitter {
	connect():void;
	disconnect():void;
	write(buffer:Buffer):void;
}

export interface InteractiveBackend {
	startGame():void;
	sendOption(option:Option, target?:number, position?:number):void;
	chooseEntitites(entities:Entity[]):void;
	exitGame():void;
}

export interface StreamScrubber extends EventEmitter {
	play():void;
	pause():void;
	setSpeed(speed:number):void;
	seek(time:number):void;
	isPlaying():boolean;
	canInteract():boolean;
	canRewind():boolean;
	rewind():void;
	getCurrentTime():number;
}

export interface CardData {
	id:string;

	// enums
	rarity?:string;
	faction?:string;
	set?:string;
	playerClass?:string;
	type?:string;
	race?:string;

	// localized
	name?:string;
	text?:string;
	flavor?:string;
	howToEarn?:string;
	howToEarnGolden?:string;
	targetingArrowText?:string;
	textInPlay?:string;

	// additional
	collectible?:boolean;
	cost?:number;
	attack?:number;
	health?:number;
	durability?:number;
	dust?:number[];

	mechanics?:string[]; // enum
	artist?:string;
}

export interface CardDataProps {
	cards:Immutable.Map<string, CardData>;
}