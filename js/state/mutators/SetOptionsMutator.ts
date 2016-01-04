'use strict';

import Immutable = require('immutable');
import Entity = require("../../Entity");
import GameState = require('../GameState');
import GameStateMutator = require('../GameStateMutator');
import Option = require('../../Option');

class SetOptionsMutator implements GameStateMutator {
	constructor(public options:Immutable.Map<number, Option>) {
	}

	public applyTo(state:GameState):GameState {
		var oldOptions = state.getOptions();
		if (this.options === oldOptions) {
			console.debug('Options are identical');
			return state;
		}

		var optionTree = this.buildOptionTree(this.options, state.getEntities());

		return new GameState(state.getEntities(), state.getEntityTree(), this.options, optionTree)
	}

	protected buildOptionTree(options:Immutable.Map<number, Option>, entities:Immutable.Map<number, Entity>):Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Option>>> {
		var optionTree = Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Option>>>();
		optionTree = optionTree.withMutations(function (map) {
			options.forEach(function (option:Option) {
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

export = SetOptionsMutator;