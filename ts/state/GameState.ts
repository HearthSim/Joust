import Entity from "../Entity";
import Option from "../Option";
import GameStateMutator from "./GameStateMutator";
import * as Immutable from "immutable";

class GameState {

	constructor(protected entities?: Immutable.Map<number, Entity>,
		protected entityTree?: Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Entity>>>,
		protected options?: Immutable.Map<number, Option>,
		protected optionTree?: Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Option>>>,
		protected time?: number) {
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
		if (typeof (this.time) === 'undefined') {
			this.time = null;
		}
	}

	public getEntity(id: number) {
		return this.entities.get(id);
	}

	public getEntities(): Immutable.Map<number, Entity> {
		return this.entities;
	}

	public getEntityTree(): Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Entity>>> {
		return this.entityTree;
	}

	public getPlayerCount(): number {
		return this.entityTree.count();
	}

	public getOptions(): Immutable.Map<number, Option> {
		return this.options;
	}

	public getOptionTree(): Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Option>>> {
		return this.optionTree;
	}

	public getTime(): number {
		return this.time;
	}

	public apply(mutator: GameStateMutator): GameState {
		return mutator.applyTo(this);
	}
}

export default GameState;
