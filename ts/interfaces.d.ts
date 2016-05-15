import * as React from "react";
import Entity from "./Entity";
import Option from "./Option";
import GameStateMutator from "./state/GameStateMutator";
import GameState from "./state/GameState";
import {EventEmitter} from "events";
import * as Stream from "stream";
import GameStateSink from "./state/GameStateSink";
import GameStateScrubber from "./state/GameStateScrubber";
import GameStateHistory from "./state/GameStateHistory";
import Player from "./Player";

export interface DropTargetProps {
	connectDropTarget?(jsx);
	isOver?;
}

export interface DragSourceProps {
	connectDragSource?(jsx);
}

export interface EntityInPlayProps extends EntityProps, OptionProps, DragSourceProps, DropTargetProps, React.Props<any> {
	isTarget: boolean;
}

export interface EntityListProps extends OptionCallbackProps, ControllerProps, DropTargetProps, CardDataProps, CardOracleProps, AssetDirectoryProps, TextureDirectoryProps, React.Props<any> {
	entities: Immutable.Iterable<number, Entity>;
	options?: Immutable.Iterable<number, Option>;
	isTop?: boolean;
}

export interface ControllerProps {
	controller?: Player;
}

export interface EntityProps extends CardDataProps, ControllerProps, AssetDirectoryProps, TextureDirectoryProps {
	entity: Entity;
}

export interface OptionCallbackProps {
	optionCallback?(option: Option, target?: number, position?: number): void;
}

export interface OptionProps extends OptionCallbackProps {
	option: Option;
}

export interface JoustClient {
	isInteractive(): boolean;
}

export interface ActionHandler {
	sendOption(option: Option): void;
}

export interface KettleClient extends EventEmitter {
	connect(): void;
	disconnect(): void;
	write(buffer: Buffer): void;
}

export interface InteractiveBackend {
	startGame(): void;
	sendOption(option: Option, target?: number, position?: number): void;
	chooseEntities(entities: Entity[]): void;
	exitGame(): void;
}

export interface StreamScrubber extends EventEmitter {
	play(): void;
	pause(): void;
	toggle(): void;
	setSpeed(speed: number): void;
	seek(time: number): void;
	isPlaying(): boolean;
	isPaused(): boolean;
	canInteract(): boolean;
	canRewind(): boolean;
	rewind(): void;
	fastForward(): void;
	getCurrentTime(): number;
	getSpeed(): number;
	canPlay(): boolean;
	getHistory(): GameStateHistory;
	getDuration(): number;
	setInhibitor(inhibitor: StreamScrubberInhibitor): void;
	nextTurn(): void;
	previousTurn(): void;
	skipBack(): void;
	hasEnded(): boolean;
}

export interface CardData {
	id?: string;

	// enums
	rarity?: string;
	faction?: string;
	set?: string;
	playerClass?: string;
	type?: string;
	race?: string;

	// localized
	name?: string;
	text?: string;
	flavor?: string;
	howToEarn?: string;
	howToEarnGolden?: string;
	targetingArrowText?: string;
	textInPlay?: string;

	// additional
	collectible?: boolean;
	cost?: number;
	attack?: number;
	health?: number;
	durability?: number;
	dust?: number[];

	mechanics?: string[]; // enum
	artist?: string;
	texture?: string;
}

export interface CardDataProps {
	cards?: Immutable.Map<string, CardData>;
}

export interface CardOracleProps {
	cardOracle?: Immutable.Map<number, string>;
}

export interface CardOracle extends EventEmitter {
	getCardMap(): Immutable.Map<number, string>;
}

export interface AssetDirectoryProps {
	assetDirectory: string;
}

export interface TextureDirectoryProps {
	textureDirectory: string;
}

export interface QueryCardMetadata {
	(build: number, cb: (cards: CardData[]) => void): void;
}

export interface GameWidgetProps extends AssetDirectoryProps, TextureDirectoryProps, React.Props<any> {
	sink: GameStateSink;
	interaction?: InteractiveBackend;
	scrubber?: StreamScrubber;
	getImageURL?: (cardId: string) => string;
	exitGame?: () => void;
	cardOracle: CardOracle;
	width?: any;
	height?: any;
	debug?: boolean;
}

export interface StreamScrubberInhibitor {
	isInhibiting: () => boolean;
}

export interface RankProps extends AssetDirectoryProps, TextureDirectoryProps, React.Props<any> {
	rank?: number;
	legendRank?: number;
}
