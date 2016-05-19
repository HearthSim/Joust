import GameState from "../GameState";
import GameStateMutator from "../GameStateMutator";
import GameStateDescriptor from "../GameStateDescriptor";

class SetDescriptorMutator implements GameStateMutator {
	constructor(public descriptor: GameStateDescriptor) {
	}

	public applyTo(state: GameState): GameState {
		return new GameState(state.getEntities(), state.getEntityTree(), state.getOptions(), state.getOptionTree(), state.getTime(), state.getChoices(), this.descriptor);
	}
}

export default SetDescriptorMutator;
