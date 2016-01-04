/// <reference path="../../node_modules/immutable/dist/immutable.d.ts"/>
/// <reference path="./GameStateMutator.d.ts"/>
'use strict';

import Entity = require('../Entity');
import Option = require('../Option');
import GameStateMutator = require('./GameStateMutator');
import Immutable = require('immutable');

class GameState {

	constructor(protected entities?:Immutable.Map<number, Entity>,
				protected entityTree?:Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Entity>>>,
				protected options?:Immutable.Map<number, Option>,
				protected optionTree?:Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Option>>>) {
		if (!this.entities) {
			this.entities = Immutable.Map<number, Entity>();
		}
		if (!this.entityTree) {
			this.entityTree = Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Entity>>>();
		}
		if (!this.options) {
			this.options = Immutable.Map<number, Option>();
		}
		if (!this.optionTree) {
			this.optionTree = Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Option>>>();
		}
	}

	public getEntity(id:number) {
		return this.entities.get(id);
	}

	public getEntities():Immutable.Map<number, Entity> {
		return this.entities;
	}

	public getEntityTree():Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Entity>>> {
		return this.entityTree;
	}

	public getOptions():Immutable.Map<number, Option> {
		return this.options;
	}

	public getOptionTree():Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Option>>> {
		return this.optionTree;
	}

	public apply(mutator:GameStateMutator):GameState {
		return mutator.applyTo(this);
	}
}

export = GameState;