import GameState from "./GameState";

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

		while (time > this.pointer.state.getTime() && this.pointer.next) {
			// we want to move towards the head
			this.pointer = this.pointer.next;
		}

		while (time < this.pointer.state.getTime() && this.pointer.prev) {
			// we want to move towards the tail
			this.pointer = this.pointer.prev;
		}

		return this.pointer.state;
	}
}

export default GameStateHistory;