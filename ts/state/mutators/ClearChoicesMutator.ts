import GameState from "../GameState";
import GameStateMutator from "../GameStateMutator";
import Option from "../../Option";

class ClearChoicesMutator implements GameStateMutator {
	constructor(public player: number) {

	}

	public applyTo(state: GameState): GameState {
		if(!this.player) {
			console.error('Missing player');
			return state;
		}

		let oldChoices = state.getChoices();
		let newChoices = state.getChoices().delete(+this.player);

		if(newChoices === oldChoices) {
			return state;
		}

		return new GameState(state.getEntities(), state.getEntityTree(), state.getOptions(), state.getOptionTree().clear(), state.getTime(), newChoices, state.getDescriptor());
	}
}

export default ClearChoicesMutator;
