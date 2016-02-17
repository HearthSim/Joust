import GameState from "../GameState";
import GameStateMutator from "../GameStateMutator";

class IncrementTimeMutator implements GameStateMutator {

	public applyTo(state:GameState):GameState {
		var time = state.getTime();
		if (time === null) {
			time = 0;
		}

		time += 1;

		return new GameState(state.getEntities(), state.getEntityTree(), state.getOptions(), state.getOptionTree(), time);
	}
}

export default IncrementTimeMutator;