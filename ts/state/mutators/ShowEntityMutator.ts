import GameState from "../GameState";
import GameStateMutator from "../GameStateMutator";
import * as Immutable from "immutable";
import ReplaceEntityMutator from "./ReplaceEntityMutator";

class ShowEntityMutator implements GameStateMutator {

	constructor(public entityId: number, public cardId: string, public tags: Immutable.Map<string, number>, public replaceTags: boolean = false) {
	}

	public applyTo(state: GameState): GameState {
		var oldEntity = state.getEntity(this.entityId);
		if (!oldEntity) {
			console.error('Cannot show non-existent entity #' + this.entityId);
			return state;
		}

		var newEntity = oldEntity.setCardId(this.cardId);

		if(this.replaceTags) {
			newEntity = newEntity.setTags(Immutable.Map<string, number>());
		}

		newEntity = newEntity.setTags(this.tags);

		var mutator = new ReplaceEntityMutator(newEntity);

		return state.apply(mutator);
	}
}

export default ShowEntityMutator;
