import GameState from "../GameState";
import GameStateMutator from "../GameStateMutator";
import ReplaceEntityMutator from "./ReplaceEntityMutator";
import AddDiffsMutator from "./AddDiffsMutator";
import {GameStateDiff} from "../../interfaces";

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
			// tag value did not change
			return state;
		}

		let diff: GameStateDiff = {
			entity: this.id,
			tag: this.tag,
			previous: oldEntity.getTag(this.tag),
			current: this.value,
		};

		return state
			.apply(new ReplaceEntityMutator(newEntity))
			.apply(new AddDiffsMutator([diff]));
	}
}

export default TagChangeMutator;
