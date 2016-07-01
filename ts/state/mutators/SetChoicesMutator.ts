import * as Immutable from "immutable";
import GameState from "../GameState";
import GameStateMutator from "../GameStateMutator";
import Choice from "../../Choice";
import Choices from "../../Choices";

class SetChoicesMutator implements GameStateMutator {
	constructor(public player: number, public choices: Choices) {
	}

	public applyTo(state: GameState): GameState {
		let choices = state.getChoices();
		choices = choices.set(+this.player, this.choices);
		return new GameState(state.getEntities(), state.getEntityTree(), state.getOptions(), state.getOptionTree(), state.getTime(), choices, state.getDescriptors(), state.getDiffs());
	}
}

export default SetChoicesMutator;
