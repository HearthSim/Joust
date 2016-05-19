import GameState from "../GameState";
import GameStateMutator from "../GameStateMutator";
import Option from "../../Option";

class ClearOptionsMutator implements GameStateMutator {
	public applyTo(state: GameState): GameState {
		if (state.getOptions().isEmpty()) {
			return state;
		}

		return new GameState(state.getEntities(), state.getEntityTree(), state.getOptions().clear(), state.getOptionTree().clear(), state.getTime(), state.getChoices(), state.getDescriptor());
	}
}

export default ClearOptionsMutator;
