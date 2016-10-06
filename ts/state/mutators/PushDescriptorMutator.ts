import GameState from "../GameState";
import GameStateMutator from "../GameStateMutator";
import GameStateDescriptor from "../GameStateDescriptor";
import {GameTag} from "../../enums";

export default class PushDescriptorMutator implements GameStateMutator {
	constructor(public descriptor: GameStateDescriptor) {
	}

	public applyTo(state: GameState): GameState {
		if (this.descriptor.target) {
			let target = state.entities.get(this.descriptor.target);
			if (target) {
				let entity = state.entities.get(this.descriptor.entityId);
				this.descriptor = new GameStateDescriptor(
					this.descriptor.entityId,
					this.descriptor.target,
					this.descriptor.type,
					this.descriptor.metaData,
					entity.getTag(GameTag.CONTROLLER) === target.getTag(GameTag.CONTROLLER)
				);
			}
		}
		
		let descriptors = state.descriptors.push(this.descriptor);

		return new GameState(state.entities, state.entityTree, state.options, state.optionTree, state.time, state.choices, descriptors, state.diffs);
	}
}
