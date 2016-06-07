import GameState from "../GameState";
import GameStateMutator from "../GameStateMutator";
import GameStateDescriptor from "../GameStateDescriptor";

class PushDescriptorMutator implements GameStateMutator {
	constructor(public descriptor: GameStateDescriptor) {
	}

	public applyTo(state: GameState): GameState {
		let descriptors = state.getDescriptors().push(this.descriptor);
		return new GameState(state.getEntities(), state.getEntityTree(), state.getOptions(), state.getOptionTree(), state.getTime(), state.getChoices(), descriptors);
	}
}

export default PushDescriptorMutator;
