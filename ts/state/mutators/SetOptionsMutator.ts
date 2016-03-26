import * as Immutable from "immutable";
import Entity from "../../Entity";
import GameState from '../GameState';
import GameStateMutator from '../GameStateMutator';
import Option from '../../Option';

class SetOptionsMutator implements GameStateMutator {
	constructor(public options: Immutable.Map<number, Option>) {
	}

	public applyTo(state: GameState): GameState {
		var oldOptions = state.getOptions();
		if (this.options === oldOptions) {
			console.debug('Options are identical');
			return state;
		}

		var optionTree = this.buildOptionTree(this.options, state.getEntities());

		return new GameState(state.getEntities(), state.getEntityTree(), this.options, optionTree, state.getTime())
	}

	protected buildOptionTree(options: Immutable.Map<number, Option>, entities: Immutable.Map<number, Entity>): Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Option>>> {
		var optionTree = Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Option>>>();
		optionTree = optionTree.withMutations(function(map) {
			options.forEach(function(option: Option) {
				if (!option.getEntity()) {
					return;
				}
				var entity = entities.get(option.getEntity());
				map = map.setIn([entity.getController(), entity.getZone(), entity.getId()], option);
			});
		});
		return optionTree;
	}
}

export default SetOptionsMutator;
