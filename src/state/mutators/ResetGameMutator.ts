import GameState from "../GameState";
import GameStateMutator from "../GameStateMutator";

export default class ResetGameMutator implements GameStateMutator {
	public applyTo(state: GameState): GameState {
		const entities = state.entities
			.filter(
				(entity, id) =>
					id === 1 ||
					state.getPlayers().some((player) => player.id === id),
			)
			.toMap();

		return new GameState(
			entities,
			null,
			state.options.clear(),
			state.optionTree.clear(),
			state.time,
			state.choices,
			state.descriptors,
			state.diffs,
		);
	}
}
