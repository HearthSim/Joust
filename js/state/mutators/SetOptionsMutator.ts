'use strict';

import GameState = require('../GameState');
import GameStateMutator = require('../GameStateMutator');
import Option = require('../../Option');

class SetOptionsMutator implements GameStateMutator {
	constructor(public options:Immutable.Map<number, Option>) {
	}

	public applyTo(state:GameState):GameState {
		var oldOptions = state.getOptions();
		if(this.options === oldOptions) {
			console.debug('Options are identical');
			return state;
		}

		return new GameState(state.getEntities(), state.getEntityTree(), this.options);
	}
}

export = SetOptionsMutator;