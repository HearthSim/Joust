import GameState from "./GameState";
import * as Stream from "stream";
import {StreamScrubber} from "../interfaces";
import {EventEmitter} from "events";

class GameStateSink extends Stream.Writable {
	constructor() {
		var opts: Stream.WritableOptions = {};
		opts.objectMode = true;
		super(opts);
	}

	_write(chunk: any, encoding: string, callback: Function) {
		this.emit('gamestate', chunk);
		callback();
	}
}

export default GameStateSink;
