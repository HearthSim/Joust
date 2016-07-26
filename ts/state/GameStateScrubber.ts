import GameState from "./GameState";
import * as Stream from "stream";
import {StreamScrubber} from "../interfaces";
import GameStateHistory from "./GameStateHistory";
import {StreamScrubberInhibitor} from "../interfaces";
import {GameTag} from "../enums";

class GameStateScrubber extends Stream.Duplex implements StreamScrubber {

	protected history: GameStateHistory;
	protected inhibitor: StreamScrubberInhibitor;

	constructor(history?: GameStateHistory, startFromTurn?: number, opts?: Stream.DuplexOptions) {
		opts = opts || {};
		opts.objectMode = true;
		opts.allowHalfOpen = true;
		super(opts);
		this.interval = null;
		this.initialTime = null;
		this.currentTime = 0;
		this.speed = 1;
		this.multiplier = 1;
		this.history = history || new GameStateHistory();
		this.lastState = null;
		this.endTime = null;
		this.hasEmittedReady = false;
		this.hasStarted = false;
		this.startFromTurn = startFromTurn || null;
	}

	protected initialTime: number;
	protected currentTime: number;
	protected endTime: number;
	protected hasEmittedReady: boolean;
	protected hasStarted: boolean;
	protected startFromTurn: number;

	_write(gameState: any, encoding: string, callback: Function): void {
		var time = gameState.time;

		let ready = false;

		if (time !== null) {
			// setup initial time if unknown
			if (this.initialTime === null) {
				this.initialTime = time;
				ready = true;
			}

			// track game state
			this.history.push(gameState);

			if(this.endTime === null || time > this.endTime) {
				this.endTime = time;
			}
		}

		if (!this.hasStarted && this.currentTime === 0 && this.startFromTurn) {
			ready = false;
			if(this.history.turnMap.has(this.startFromTurn)) {
				this.currentTime = this.history.turnMap.get(this.startFromTurn).time;
				ready = true;
			}
		}

		if (ready) {
			this.emit("ready");
			this.hasEmittedReady = true;
			this.update();
		}

		callback();
	}

	_read(): void {
		return;
	}

	end(): void {
		if(!this.hasEmittedReady) {
			// this might happen if a initial turn is requested that we never found
			this.emit("ready");
			this.hasEmittedReady = true;
			this.update();
		}
	}

	protected lastUpdate: number;
	protected interval: number;

	public play(): void {
		this.lastUpdate = new Date().getTime();
		this.interval = setInterval(this.update.bind(this), 100);
		this.hasStarted = true;
		this.emit("play");
		this.lastState = null;
		this.update();
	}

	public pause(): void {
		if (this.interval !== null) {
			clearInterval(this.interval);
			this.interval = null;
		}
		this.emit("pause");
		this.update();
	}

	public toggle(): void {
		if (this.isPlaying()) {
			this.pause();
		}
		else {
			this.play();
		}
	}

	protected speed: number;
	protected multiplier: number;
	protected lastState: GameState;

	protected update(): void {
		if (this.initialTime === null) {
			return;
		}

		let lastTurn = this.currentTurn;

		if (this.isPlaying() && this.speed != 0) {
			let now = new Date().getTime();
			let elapsed = (now - this.lastUpdate) * this.speed * this.multiplier;
			this.lastUpdate = now;

			if (!this.isInhibited()) {
				this.currentTime += elapsed / 1000;

				if (this.hasEnded()) {
					this.currentTime = this.endTime - this.initialTime;
					this.pause();
					return;
				}
			}
		}

		var latest = this.history.getLatest(this.currentTime + this.initialTime);
		if (latest !== this.lastState) {
			this.lastState = latest;
			this.push(latest);
		}

		let currentTurn = this.currentTurn;
		if(lastTurn !== currentTurn) {
			this.emit("turn", currentTurn);
		}

		this.emit("update");
	}


	public seek(time: number): void {
		if (time === this.currentTime) {
			return;
		}
		this.currentTime = time;
		this.update();
	}

	public isPlaying(): boolean {
		return this.interval !== null;
	}

	public isPaused(): boolean {
		return !this.isPlaying();
	}

	public rewind(): void {
		this.currentTime = 0;
		this.update();
	}

	public fastForward(): void {
		this.currentTime = this.endTime - this.initialTime;
		this.pause();
	}

	public setSpeed(speed: number): void {
		this.speed = speed;
		this.update();
	}

	public getSpeed(): number {
		return this.speed;
	}

	public canInteract(): boolean {
		return this.hasStarted;
	}

	public canRewind(): boolean {
		return this.currentTime > 0 || this.isPlaying();
	}

	public getCurrentTime(): number {
		return this.currentTime;
	}

	public hasEnded(): boolean {
		return this.currentTime + this.initialTime >= this.endTime;
	}

	public canPlay(): boolean {
		return !this.hasEnded() && this.canInteract();
	}

	public getHistory(): GameStateHistory {
		return this.history;
	}

	public getDuration(): number {
		return Math.max(this.endTime - this.initialTime, 0);
	}

	public setInhibitor(inhibitor: StreamScrubberInhibitor): void {
		this.inhibitor = inhibitor;
	}

	protected isInhibited() {
		return this.inhibitor && this.inhibitor.isInhibiting();
	}

	get currentTurn(): number {
		if(!this.lastState) {
			return null;
		}
		let game = this.lastState.game;
		if(!game) {
			return null;
		}
		if(!this.history.turnMap.has(1)) {
			return 0;
		}
		let turnOne = this.history.turnMap.get(1);
		if(this.lastState.time < turnOne.time) {
			return 0;
		}
		return game.getTag(GameTag.TURN) || 0;
	}

	public nextTurn(): void {
		let nextTurn = this.endTime - this.initialTime;
		let currentTurn = this.currentTurn;
		if (this.currentTime < this.history.turnMap.first().time) {
			currentTurn--;
		}
		let turn = currentTurn + 1;
		while (!this.history.turnMap.has(turn) && turn < this.history.turnMap.count()) {
			turn++;
		}
		if (this.history.turnMap.has(turn)) {
			nextTurn = this.history.turnMap.get(turn).time;
		}
		this.currentTime = nextTurn;
		this.update();
	}

	public previousTurn(): void {
		let previousTurn = this.initialTime;
		let currentTurn = this.currentTurn;
		let turn = currentTurn - 1;
		while (!this.history.turnMap.has(turn) && turn > 0) {
			turn--;
		}
		if (this.history.turnMap.has(turn)) {
			previousTurn = this.history.turnMap.get(turn).time;
		}
		this.currentTime = previousTurn;
		this.update();
	}

	public skipBack(): void {
		let currentTurn = this.currentTurn;
		let turnStart = this.history.turnMap.get(currentTurn).time;
		let timeElapsed = this.currentTime - turnStart;
		if (timeElapsed > 1.5 * this.speed * this.multiplier) {
			this.currentTime = turnStart;
			this.update();
		}
		else {
			this.previousTurn();
		}
	}
}

export default GameStateScrubber;
