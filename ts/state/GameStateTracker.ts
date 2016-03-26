import GameState from "./GameState";
import * as Stream from "stream";

class GameStateTracker extends Stream.Transform {

	public gameState: GameState;

	constructor(initialGameState?: GameState, opts?: Stream.TransformOptions) {
		opts = opts || {};
		opts.objectMode = true;
		super(opts);
		this.gameState = initialGameState || new GameState();
	}

	_transform(mutator: any, encoding: string, callback: Function): void {
		var oldState = this.gameState;
		this.gameState = this.gameState.apply(mutator);
		if (oldState !== this.gameState) {
			this.push(this.gameState);
		}
		callback();
	}
}

export default GameStateTracker;
