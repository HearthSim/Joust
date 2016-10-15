import GameState from "../GameState";
import GameStateMutator from "../GameStateMutator";
import IncrementTimeMutator from "../mutators/IncrementTimeMutator";
import TagChangeMutator from "../mutators/TagChangeMutator";
import GameStateTrackerPlugin from "../GameStateTrackerPlugin";

/**
 * Increments the game state time on every tag change.
 */
export default class DebugTimer extends GameStateTrackerPlugin {

	public onAfterMutate(mutator: GameStateMutator, state: GameState): void|GameState {
		if (mutator instanceof TagChangeMutator) {
			return state.apply(new IncrementTimeMutator(1));
		}
	}
}
