import GameState from "./GameState";
import {GameTag} from "../enums";
import {Step} from "../enums";
import * as Immutable from "immutable";
import {HistoryEntry} from "../interfaces";

/**
 * Organizes game states in a linear history.
 */
export default class GameStateHistory {
	public tail: HistoryEntry = null; // earliest
	public head: HistoryEntry = null; // latest
	public pointer: HistoryEntry = null;
	public turnMap: Immutable.Map<number, GameState> = Immutable.OrderedMap<number, GameState>();

	public push(gameState: GameState): void {
		let time = gameState.time;
		if (typeof time !== "number") {
			// we cannot handle timeless game states
			return;
		}

		let game = gameState.game;
		if (game) {
			let turn = +game.getTag(GameTag.TURN);
			if (!this.turnMap.has(turn)) {
				if (game.getTag(GameTag.STEP) === Step.MAIN_START) {
					this.turnMap = this.turnMap.set(turn, gameState);
				}
			}
		}

		if (!this.tail && !this.head) {
			let element = { state: gameState };
			this.tail = element;
			this.head = element;
			this.pointer = element;
			return;
		}

		if (time > this.head.state.time) {
			let element = { state: gameState, prev: this.head };
			this.head.next = element;
			this.head = element;
		}
		else if (time === this.head.state.time) {
			// overwrite state if time is identical
			this.head.state = gameState;
		}
		else {
			console.error("Replay contains out-of-order timestamps");
		}
	}

	public getLatest(time: number): GameState {
		if (!this.pointer) {
			return null;
		}

		while (this.pointer.state.time < time && this.pointer.next) {
			// we want to move towards the head

			if (this.pointer.next.state.time > time) {
				// do not pass the last state before time
				break;
			}

			this.pointer = this.pointer.next;
		}

		while (this.pointer.state.time > time && this.pointer.prev) {
			// we want to move towards the tail
			this.pointer = this.pointer.prev;
		}

		return this.pointer.state;
	}
}
