import GameState = require('./GameState');

interface ApplyTo {
	(state:GameState) : GameState;
}

interface GameStateMutator {
	applyTo: ApplyTo;
}

export = GameStateMutator;