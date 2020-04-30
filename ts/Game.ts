import Entity from "./Entity";
import * as Immutable from "immutable";
import { GameType } from "./enums";

export default class Game extends Entity {
	constructor(
		id: number,
		tags: Immutable.Map<string, number>,
		protected _type: GameType | null,
	) {
		super(id, tags);
	}

	// note this is not BnetGameType
	get type(): GameType | null {
		return this._type;
	}

	protected factory(
		tags: Immutable.Map<string, number>,
		cardId: string,
	): Entity {
		return new Game(this.id, tags, this._type);
	}
}
