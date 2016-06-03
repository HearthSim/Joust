import GameState from "../GameState";
import GameStateMutator from "../GameStateMutator";
import GameStateDescriptor from "../GameStateDescriptor";
import MetaData from "../../MetaData";

class EnrichDescriptorMutator implements GameStateMutator {
	constructor(public metaData: MetaData) {

	}

	public applyTo(state: GameState): GameState {
		let descriptor = state.getDescriptors().peek();
		let descriptors = state.getDescriptors().pop();

		let meta = descriptor.getMetaData().add(this.metaData);
		descriptor = new GameStateDescriptor(descriptor.getEntity(), descriptor.getTarget(), descriptor.getType(), meta);
		descriptors = descriptors.push(descriptor);

		return new GameState(state.getEntities(), state.getEntityTree(), state.getOptions(), state.getOptionTree(), state.getTime(), state.getChoices(), descriptors);
	}
}

export default EnrichDescriptorMutator;
