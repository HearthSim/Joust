'use strict';

import GameState = require('../GameState');
import GameStateMutator = require('../GameStateMutator');
import Entity = require('../../Entity');
import ReplaceEntityMutator = require('./ReplaceEntityMutator');

class TagChangeMutator implements GameStateMutator {
	public id;
	public tag;
	public value;

	constructor(id:number, tag:string, value:number) {
		this.id = +id;
		this.tag = '' + tag;
		this.value = +value;
	}

	public applyTo(state:GameState):GameState {
		var oldEntity = state.getEntity(this.id);
		if (!oldEntity) {
			console.error('Cannot change tag on non-existent entity #' + this.id);
			return state;
		}

		var newEntity = oldEntity.setTag(this.tag, this.value);

		if (newEntity === oldEntity) {
			console.debug(
				'No tag change ' +
				'(tag ' + this.tag + ': ' + oldEntity.getTag(this.tag) + ' → ' + this.value + ') ' +
				'on entity #' + this.id
			);
			return state;
		}

		return state.apply(new ReplaceEntityMutator(newEntity));
	}
}

export = TagChangeMutator;