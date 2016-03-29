import GameState from "../GameState";
import GameStateMutator from "../GameStateMutator";
import Entity from "../../Entity";
import ReplaceEntityMutator from "./ReplaceEntityMutator";

class TagChangeMutator implements GameStateMutator {
	public id;
	public tag;
	public value;

	constructor(id: number, tag: number, value: number) {
		this.id = +id;
		this.tag = +tag;
		this.value = +value;
	}

	public applyTo(state: GameState): GameState {
		var oldEntity = state.getEntity(this.id);
		if (!oldEntity) {
			console.error('Cannot change tag on non-existent entity #' + this.id);
			return state;
		}

		var newEntity = oldEntity.setTag(this.tag, this.value);

		if (newEntity === oldEntity) {
			console.debug(
				'No tag change ' +
				'(tag ' + this.tag + ': ' + oldEntity.getTag(this.tag) + ' → ' + this.value + ') ' +
				'on entity #' + this.id
			);
			return state;
		}

		var mutator = new ReplaceEntityMutator(newEntity);

		return state.apply(mutator);
	}
}

export default TagChangeMutator;
