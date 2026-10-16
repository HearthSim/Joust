import * as Immutable from "immutable";
import Entity from "../../Entity";
import GameState from "../GameState";
import GameStateMutator from "../GameStateMutator";
import Option from "../../Option";

export default class SetOptionsMutator implements GameStateMutator {
	constructor(public options: Immutable.Map<number, Option>) {}

	public applyTo(state: GameState): GameState {
		const oldOptions = state.options;
		if (this.options === oldOptions) {
			return state;
		}

		const optionTree = this.buildOptionTree(this.options, state.entities);

		return new GameState(
			state.entities,
			state.entityTree,
			this.options,
			optionTree,
			state.time,
			state.choices,
			state.descriptors,
			state.diffs,
		);
	}

	protected buildOptionTree(
		options: Immutable.Map<number, Option>,
		entities: Immutable.Map<number, Entity>,
	): Immutable.Map<
		number,
		Immutable.Map<number, Immutable.Map<number, Option>>
	> {
		let optionTree = Immutable.Map<
			number,
			Immutable.Map<number, Immutable.Map<number, Option>>
		>();
		optionTree = optionTree.withMutations((map) => {
			options.forEach((option: Option) => {
				if (!option.entityId) {
					return;
				}
				const entity = entities.get(option.entityId);
				map = map.setIn(
					[entity.getController(), entity.getZone(), entity.id],
					option,
				);
			});
		});
		return optionTree;
	}
}
