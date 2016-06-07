import GameState from "../GameState";
import GameStateMutator from "../GameStateMutator";

class PopDescriptorMutator implements GameStateMutator {
	public applyTo(state: GameState): GameState {
		let descriptors = state.getDescriptors().pop();

		if(descriptors === state.getDescriptors()) {
			return state;
		}

		return new GameState(state.getEntities(), state.getEntityTree(), state.getOptions(), state.getOptionTree(), state.getTime(), state.getChoices(), descriptors);
	}
}

export default PopDescriptorMutator;
