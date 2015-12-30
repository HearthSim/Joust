declare namespace Joust.State {
	interface ApplyTo {
		(state:GameState) : GameState;
	}

	export interface GameStateMutator {
		applyTo: ApplyTo;
	}
}