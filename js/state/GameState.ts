/// <reference path="../../node_modules/immutable/dist/immutable.d.ts"/>
/// <reference path="./GameStateMutator.d.ts"/>
'use strict';

namespace Joust.State {
	export class GameState {

		constructor(protected entities:Immutable.Map<number, Entity>,
					protected entityTree:Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Entity>>>,
					protected options:Immutable.Map<number, Option>) {
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

		public apply(mutator:GameStateMutator):GameState {
			return mutator.applyTo(this);
		}
	}
}
