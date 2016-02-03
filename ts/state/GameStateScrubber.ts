import GameState from "./GameState";
import * as Stream from "stream";
import {StreamScrubber} from "../interfaces";
import GameStateHistory from "./GameStateHistory";

class GameStateScrubber extends Stream.Transform implements StreamScrubber {

	protected history:GameStateHistory;

	constructor(opts?:Stream.TransformOptions) {
		opts = opts || {};
		opts.objectMode = true;
		super(opts);
		this.interval = null;
		this.initialTime = null;
		this.currentTime = 0;
		this.speed = 3;
		this.history = new GameStateHistory();
		this.lastState = null;
		this.endTime = null;
	}

	protected initialTime:number;
	protected currentTime:number;
	protected endTime:number;

	_transform(gameState:any, encoding:string, callback:Function):void {

		// setup initial time if unknown
		var time = gameState.getTime();

		if (this.initialTime !== null) {
			// add to our history
			this.history.push(gameState);
		}
		else if (time) {
			this.play();
			console.debug('Setting initial time to ' + time);
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

		this.emit('update');

		if (this.isPlaying() && this.speed != 0) {
			let now = new Date().getTime();
			let elapsed = (now - this.lastUpdate) * this.speed;
			this.lastUpdate = now;
			this.currentTime += elapsed;

			if (this.currentTime + this.initialTime > this.endTime) {
				this.pause();
				return;
			}
		}

		var latest = this.history.getLatest(this.currentTime + this.initialTime);
		if (latest !== this.lastState) {
			this.lastState = latest;
			this.push(latest);
		}
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

	public canInteract():boolean {
		return this.initialTime !== null;
	}

	public canRewind():boolean {
		return this.currentTime > 0 || this.isPlaying();
	}

	public getCurrentTime():number {
		return this.currentTime;
	}
}

export default GameStateScrubber;