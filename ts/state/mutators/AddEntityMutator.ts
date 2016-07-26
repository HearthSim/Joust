import * as Immutable from "immutable";
import GameState from "../GameState";
import GameStateMutator from "../GameStateMutator";
import Entity from "../../Entity";
import AddDiffsMutator from "./AddDiffsMutator";
import {GameStateDiff} from "../../interfaces";

class AddEntityMutator implements GameStateMutator {
	constructor(public entity: Entity) {
	}

	public applyTo(state: GameState): GameState {
		if (!this.entity) {
			console.error('Cannot add null entity');
			return state;
		}

		var id = +this.entity.id;
		if (id < 1) {
			console.error('Cannot add entity: Invalid entity id');
			return state;
		}

		var entities = state.entities;
		if (entities.has(id)) {
			console.warn('Overwriting entity with id #' + id);
			// we might have a stale entity at the old location in the entity tree
		}

		entities = entities.set(id, this.entity);

		var entityTree = state.entityTree;
		entityTree = entityTree.setIn([this.entity.getController(), this.entity.getZone(), id], this.entity);

		let diffs: GameStateDiff[] = [];
		this.entity.getTags().forEach((value: number, tag: string) => {
			diffs.push({
				entity: id,
				tag: +tag,
				previous: null,
				current: value
			});
		});

		// we always mutate the GameState when we add an entity
		state = new GameState(entities, entityTree, state.options, state.optionTree, state.time, state.choices, state.descriptors, state.diffs);

		return state.apply(new AddDiffsMutator(diffs));
	}
}

export default AddEntityMutator;
