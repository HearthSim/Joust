import GameState from "../GameState";
import GameStateMutator from "../GameStateMutator";

class SetTimeMutator implements GameStateMutator {
	constructor(public time:number) {
	}

	public applyTo(state:GameState):GameState {
		return new GameState(state.getEntities(), state.getEntityTree(), state.getOptions(), state.getOptionTree(), this.time);
	}
}

export default SetTimeMutator;