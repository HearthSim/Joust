'use strict';

import GameState = require('../GameState');
import GameStateMutator = require('../GameStateMutator');
import Option = require('../../Option');

class ClearOptionsMutator implements GameStateMutator {
	constructor() {
	}

	public applyTo(state:GameState):GameState {
		if (state.getOptions().isEmpty()) {
			console.debug('No options to clear');
			return state;
		}

		return new GameState(state.getEntities(), state.getEntityTree(), state.getOptions().clear());
	}
}

export = ClearOptionsMutator;