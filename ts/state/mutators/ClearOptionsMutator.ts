import GameState from '../GameState';
import GameStateMutator from '../GameStateMutator';
import Option from '../../Option';
import BaseMutator from "./BaseMutator";

class ClearOptionsMutator extends BaseMutator implements GameStateMutator {
	public applyTo(state:GameState):GameState {
		if (state.getOptions().isEmpty()) {
			console.debug('No options to clear');
			return state;
		}

		return new GameState(state.getEntities(), state.getEntityTree(), state.getOptions().clear(), state.getOptionTree().clear(), this.time || state.getTime());
	}
}

export default ClearOptionsMutator;