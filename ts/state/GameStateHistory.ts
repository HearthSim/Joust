import GameState from "./GameState";
import Entity from "../Entity";
import {GameTag} from "../enums";
import {Step} from "../enums";

interface ListElement {
	state: GameState;
	next?: ListElement;
	prev?: ListElement;
}

class GameStateHistory {
	public tail:ListElement = null; // earliest
	public head:ListElement = null; // latest
	public pointer:ListElement = null;

	public push(gameState:GameState):void {
		var time = gameState.getTime();
		if (!time) {
			// we cannot handle timeless game states
			return;
		}

		if (!this.tail && !this.head) {
			let element = {state: gameState};
			this.tail = element;
			this.head = element;
			this.pointer = element;
			return;
		}

		if (time >= this.head.state.getTime()) {
			let element = {state: gameState, prev: this.head};
			this.head.next = element;
			this.head = element;
		}
		else {
			console.error('Replay contains out-of-order timestamps');
		}
	}

	public getLatest(time:number):GameState {
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

	public getNextTurn(time:number):number {
		if (!this.pointer) {
			return;
		}

		let fromGame = (state:GameState):Entity => {
			return state.getEntity(1);
		};

		// move pointer to timestamp
		let oldState = this.getLatest(time);
		let oldTurn = fromGame(oldState).getTag(GameTag.TURN);

		// seek the end of the old turn
		while (fromGame(this.pointer.state).getTag(GameTag.TURN) === oldTurn && this.pointer.next) {
			this.pointer = this.pointer.next;
		}

		// seek the beginning of the new turn
		while (fromGame(this.pointer.state).getTag(GameTag.STEP) !== Step.MAIN_ACTION && this.pointer.next) {
			this.pointer = this.pointer.next;
		}

		return this.pointer.state.getTime();
	}
}

export default GameStateHistory;