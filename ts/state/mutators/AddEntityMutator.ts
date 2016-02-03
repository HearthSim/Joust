import * as Immutable from "immutable";
import GameState from '../GameState';
import GameStateMutator from '../GameStateMutator';
import Entity from '../../Entity';
import BaseMutator from "./BaseMutator";

class AddEntityMutator extends BaseMutator implements GameStateMutator {
	constructor(public entity:Entity) {
		super();
	}

	public applyTo(state:GameState):GameState {
		var newEntity = this.entity;
		if (!this.entity) {
			console.error('Cannot add null entity');
			return state;
		}

		var id = +this.entity.getId();
		if (id < 1) {
			console.error('Cannot add entity: Invalid entity id');
			return state;
		}

		var entities = state.getEntities();
		if (entities.has(id)) {
			console.warn('Overwriting entity with id #' + id);
			// we might have a stale entity at the old location in the entity tree
		}

		entities = entities.set(id, this.entity);

		var entityTree = state.getEntityTree();
		entityTree = entityTree.setIn([this.entity.getController(), this.entity.getZone(), id], this.entity);

		// we always mutate the GameState when we add an entity
		return new GameState(entities, entityTree, state.getOptions(), state.getOptionTree(), this.time || state.getTime());
	}
}

export default AddEntityMutator;