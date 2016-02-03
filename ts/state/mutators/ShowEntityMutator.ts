import GameState from '../GameState';
import GameStateMutator from '../GameStateMutator';
import Entity from '../../Entity';
import BaseMutator from "./BaseMutator";
import ReplaceEntityMutator from "./ReplaceEntityMutator";

class ShowEntityMutator extends BaseMutator implements GameStateMutator {

	constructor(public entityId:number, public cardId:string, public tags:Immutable.Map<string, number>) {
		super();
	}

	public applyTo(state:GameState):GameState {
		var oldEntity = state.getEntity(this.entityId);
		if (!oldEntity) {
			console.error('Cannot show non-existent entity #' + this.entityId);
			return state;
		}

		var newEntity = oldEntity.setCardId(this.cardId);
		newEntity = newEntity.setTags(this.tags);

		var mutator = new ReplaceEntityMutator(newEntity);
		mutator.time = this.time;

		return state.apply(mutator);
	}
}

export default ShowEntityMutator;
