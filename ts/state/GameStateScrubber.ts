import GameState from "./GameState";
import * as Stream from "stream";
import {StreamScrubber} from "../interfaces";
import GameStateHistory from "./GameStateHistory";

class GameStateScrubber extends Stream.Duplex implements StreamScrubber {

	protected history:GameStateHistory;

	constructor(history?:GameStateHistory, opts?:Stream.DuplexOptions) {
		opts = opts || {};
		opts.objectMode = true;
		opts.allowHalfOpen = true;
		super(opts);
		this.interval = null;
		this.initialTime = null;
		this.currentTime = 0;
		this.speed = 1;
		this.history = history || new GameStateHistory();
		this.lastState = null;
		this.endTime = null;
	}

	protected initialTime:number;
	protected currentTime:number;
	protected endTime:number;

	_write(gameState:any, encoding:string, callback:Function):void {

		// setup initial time if unknown
		var time = gameState.getTime();

		if (this.initialTime !== null) {
			// add to our history
			this.history.push(gameState);
		}
		else if (time) {
			this.play();
			this.initialTime = time;
		}
		else {
			// if no time is set, we're out of luck - just send it through?
			//console.warn('Passthrough for GameState without time');
			//this.push(gameState);
			callback();
			return;
		}

		if (time && (this.endTime === null || time > this.endTime)) {
			this.endTime = time;
		}

		callback();
	}

	_read():void {
		return;
	}

	protected lastUpdate:number;
	protected interval;

	public play():void {
		this.lastUpdate = new Date().getTime();
		this.interval = setInterval(this.update.bind(this), 100);
		this.update();
	}

	public pause():void {
		if (this.interval !== null) {
			clearInterval(this.interval);
			this.interval = null;
		}
		this.update();
	}

	protected speed:number;
	protected lastState:GameState;

	protected update():void {
		if (!this.initialTime) {
			return;
		}

		if (this.isPlaying() && this.speed != 0) {
			let now = new Date().getTime();
			let elapsed = (now - this.lastUpdate) * this.speed;
			this.lastUpdate = now;
			this.currentTime += elapsed / 1000;

			if (this.hasEnded()) {
				this.currentTime = this.endTime - this.initialTime;
				this.pause();
				return;
			}
		}

		var latest = this.history.getLatest(this.currentTime + this.initialTime);
		if (latest !== this.lastState) {
			this.lastState = latest;
			this.push(latest);
		}

		this.emit('update');
	}


	public seek(time:number):void {
		this.currentTime = time;
		this.update();
	}

	public isPlaying():boolean {
		return this.interval !== null;
	}

	public rewind():void {
		this.currentTime = 0;
		this.pause();
	}

	public setSpeed(speed:number):void {
		this.speed = speed;
	}

	public getSpeed():number {
		return this.speed;
	}

	public canInteract():boolean {
		return this.initialTime !== null;
	}

	public canRewind():boolean {
		return this.currentTime > 0 || this.isPlaying();
	}

	public getCurrentTime():number {
		return this.currentTime;
	}

	public hasEnded():boolean {
		return this.currentTime + this.initialTime >= this.endTime;
	}

	public canPlay():boolean {
		return !this.hasEnded() && this.canInteract();
	}

	public getHistory():GameStateHistory {
		return this.history;
	}

	public getDuration():number {
		return Math.max(this.endTime - this.initialTime, 0);
	}
}

export default GameStateScrubber;