import GameState from "./GameState";
import * as Stream from "stream";
import {StreamScrubber} from "../interfaces";
import GameStateHistory from "./GameStateHistory";
import {StreamScrubberInhibitor} from "../interfaces";
import {GameTag} from "../enums";

class GameStateScrubber extends Stream.Duplex implements StreamScrubber {

	protected history: GameStateHistory;
	protected inhibitor: StreamScrubberInhibitor;

	constructor(history?: GameStateHistory, opts?: Stream.DuplexOptions) {
		opts = opts || {};
		opts.objectMode = true;
		opts.allowHalfOpen = true;
		super(opts);
		this.interval = null;
		this.initialTime = null;
		this.currentTime = 0;
		this.speed = 2;
		this.history = history || new GameStateHistory();
		this.lastState = null;
		this.endTime = null;
	}

	protected initialTime: number;
	protected currentTime: number;
	protected endTime: number;

	_write(gameState: any, encoding: string, callback: Function): void {
		var time = gameState.getTime();

		if (time !== null) {
			// setup initial time if unknown
			if (this.initialTime === null) {
				this.play();
				this.initialTime = time;
			}

			// track game state
			this.history.push(gameState);

			if(this.endTime === null || time > this.endTime) {
				this.endTime = time;
			}
		}

		callback();
	}

	_read(): void {
		return;
	}

	protected lastUpdate: number;
	protected interval;

	public play(): void {
		this.lastUpdate = new Date().getTime();
		this.interval = setInterval(this.update.bind(this), 100);
		this.emit('play');
		this.update();
	}

	public pause(): void {
		if (this.interval !== null) {
			clearInterval(this.interval);
			this.interval = null;
		}
		this.emit('pause');
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
	protected lastState: GameState;

	protected update(): void {
		if (this.initialTime === null) {
			return;
		}

		if (this.isPlaying() && this.speed != 0) {
			let now = new Date().getTime();
			let elapsed = (now - this.lastUpdate) * this.speed;
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

		this.emit('update');
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
		return this.initialTime !== null;
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

	public nextTurn(): void {
		let nextTurn = this.endTime - this.initialTime;
		let currentTurn = this.lastState.getEntity(1).getTag(GameTag.TURN);
		if (this.currentTime < this.history.turnMap.first().getTime()) {
			currentTurn--;
		}
		let turn = currentTurn + 1;
		while (!this.history.turnMap.has(turn) && turn < this.history.turnMap.count()) {
			turn++;
		}
		if (this.history.turnMap.has(turn)) {
			nextTurn = this.history.turnMap.get(turn).getTime();
		}
		this.currentTime = nextTurn;
		this.update();
	}

	public previousTurn(): void {
		let previousTurn = this.initialTime;
		let currentTurn = this.lastState.getEntity(1).getTag(GameTag.TURN);
		let turn = currentTurn - 1;
		while (!this.history.turnMap.has(turn) && turn > 0) {
			turn--;
		}
		if (this.history.turnMap.has(turn)) {
			previousTurn = this.history.turnMap.get(turn).getTime();
		}
		this.currentTime = previousTurn;
		this.update();
	}

	public skipBack(): void {
		let currentTurn = this.lastState.getEntity(1).getTag(GameTag.TURN);
		let turnStart = this.history.turnMap.get(currentTurn).getTime();
		let timeElapsed = this.currentTime - turnStart;
		if (timeElapsed > 1.5 * this.speed) {
			this.currentTime = turnStart;
			this.update();
		}
		else {
			this.previousTurn();
		}
	}
}

export default GameStateScrubber;
