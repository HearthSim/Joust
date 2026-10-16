import GameState from "../GameState";
import GameStateMutator from "../GameStateMutator";
import GameStateDescriptor from "../GameStateDescriptor";
import MetaData from "../../MetaData";

export default class EnrichDescriptorMutator implements GameStateMutator {
	constructor(public metaData: MetaData) {}

	public applyTo(state: GameState): GameState {
		let descriptor = state.descriptors.peek();

		if (!descriptor) {
			console.warn("Ignoring MetaData outside of Block");
			return state;
		}

		let descriptors = state.descriptors.pop();

		const meta = descriptor.metaData.add(this.metaData);
		descriptor = new GameStateDescriptor(
			descriptor.entityId,
			descriptor.target,
			descriptor.type,
			descriptor.triggerKeyword,
			meta,
		);
		descriptors = descriptors.push(descriptor);

		return new GameState(
			state.entities,
			state.entityTree,
			state.options,
			state.optionTree,
			state.time,
			state.choices,
			descriptors,
			state.diffs,
		);
	}
}
