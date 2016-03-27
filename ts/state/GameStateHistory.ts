import GameState from "./GameState";
import Entity from "../Entity";
import {GameTag} from "../enums";
import {Step} from "../enums";
import * as Immutable from "immutable";

interface ListElement {
	state: GameState;
	next?: ListElement;
	prev?: ListElement;
}

class GameStateHistory {
	public tail: ListElement = null; // earliest
	public head: ListElement = null; // latest
	public pointer: ListElement = null;
	public turnMap: Immutable.Map<number, GameState> = Immutable.OrderedMap<number, GameState>();

	public push(gameState: GameState): void {
		var time = gameState.getTime();
		if (!time) {
			// we cannot handle timeless game states
			return;
		}

		if (!this.tail && !this.head) {
			let element = { state: gameState };
			this.tail = element;
			this.head = element;
			this.pointer = element;
			return;
		}

		if (time > this.head.state.getTime()) {
			let element = { state: gameState, prev: this.head };
			this.head.next = element;
			this.head = element;
		}
		else if (time === this.head.state.getTime()) {
			// overwrite state if time is identical
			this.head.state = gameState;
		}
		else {
			console.error('Replay contains out-of-order timestamps');
		}

		let game = gameState.getEntity(1);
		if (game) {
			let turn = +game.getTag(GameTag.TURN);
			if (!this.turnMap.has(turn) && game.getTag(GameTag.STEP) === Step.MAIN_START_TRIGGERS) {
				this.turnMap = this.turnMap.set(turn, gameState);
			}
		}
	}

	public getLatest(time: number): GameState {
		if (!this.pointer) {
			return;
		}

		while (this.pointer.state.getTime() < time && this.pointer.next) {
			// we want to move towards the head

			if (this.pointer.next.state.getTime() > time) {
				// do not pass the last state before time
				break;
			}

			this.pointer = this.pointer.next;
		}

		while (this.pointer.state.getTime() > time && this.pointer.prev) {
			// we want to move towards the tail
			this.pointer = this.pointer.prev;
		}

		return this.pointer.state;
	}
}

export default GameStateHistory;
