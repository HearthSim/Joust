import GameState from "../GameState";
import GameStateMutator from "../GameStateMutator";

class PopDescriptorMutator implements GameStateMutator {
	public applyTo(state: GameState): GameState {
		let descriptors = state.descriptors.pop();

		if(descriptors === state.descriptors) {
			return state;
		}

		return new GameState(state.entities, state.entityTree, state.options, state.optionTree, state.time, state.choices, descriptors, state.diffs);
	}
}

export default PopDescriptorMutator;
