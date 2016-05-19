import GameState from "../GameState";
import GameStateMutator from "../GameStateMutator";

class ClearDescriptorMutator implements GameStateMutator {
	public applyTo(state: GameState): GameState {
		if (!state.getDescriptor()) {
			return state;
		}

		return new GameState(state.getEntities(), state.getEntityTree(), state.getOptions(), state.getOptionTree(), state.getTime(), state.getChoices(), null);
	}
}

export default ClearDescriptorMutator;
