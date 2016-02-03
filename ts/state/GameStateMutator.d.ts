import GameState from './GameState';

interface ApplyTo {
	(state:GameState) : GameState;
}

interface GameStateMutator {
	applyTo: ApplyTo;
	time: number;
}

export default GameStateMutator;