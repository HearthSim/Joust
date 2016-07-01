import GameState from "../GameState";
import GameStateMutator from "../GameStateMutator";
import * as _ from "lodash";
import {GameStateDiff} from "../../interfaces";

class AddDiffsMutator implements GameStateMutator {

	constructor(public diffs: GameStateDiff[]) {
	}

	public applyTo(state: GameState): GameState {
		let diffs = state.getDiffs();
		_.forEach(this.diffs, (diff: GameStateDiff) => {
			diffs = diffs.add(diff);
		});
		return new GameState(state.getEntities(), state.getEntityTree(), state.getOptions(), state.getOptionTree(), state.getTime(), state.getChoices(), state.getDescriptors(), diffs);
	}
}

export default AddDiffsMutator;
