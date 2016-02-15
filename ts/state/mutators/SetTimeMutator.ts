import BaseMutator from "./BaseMutator";
import GameState from "../GameState";

class SetTimeMutator extends BaseMutator {
	constructor(time:number) {
		super();
		this.time = time;
	}

	public applyTo(state:GameState):GameState {
		return new GameState(state.getEntities(), state.getEntityTree(), state.getOptions(), state.getOptionTree(), this.time || state.getTime())
	}
}

export default SetTimeMutator;