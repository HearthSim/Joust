/// <reference path="../../node_modules/immutable/dist/immutable.d.ts"/>
/// <reference path="./GameStateMutator.d.ts"/>
'use strict';

namespace Joust.State {

	export class GameStateTracker {

		private history:Immutable.Map<number, GameState>;

		constructor(private state?:GameState) {
			if (!state) {
				this.state = new State.GameState(
					Immutable.Map<number, Entity>(),
					Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Entity>>>(),
					Immutable.Map<number, Joust.Option>()
				);
			}
			this.history = Immutable.Map<number, GameState>();
		}

		public apply(mutator:GameStateMutator) {
			this.state = this.state.apply(mutator);
		}

		public mark(timestamp:number) {
			if (this.history.has(timestamp)) {
				return;
			}
			this.history = this.history.set(timestamp, this.state);
			console.log('Mark at ' + (timestamp / 1000) + ' (now at ' + this.history.size + ')');
			this.listener();
		}

		public getGameState() {
			return this.state;
		}

		private listener = null;

		public on(event, cb) {
			this.listener = cb;
		}

	}
}
