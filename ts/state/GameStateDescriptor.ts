import * as Immutable from "immutable";
import { BlockType, GameTag } from "../enums";
import MetaData from "../MetaData";

export default class GameStateDescriptor {
	constructor(
		private _entityId: number,
		private _target: number,
		private _blockType: BlockType,
		private _triggerKeyword: GameTag | null,
		private _metaData?: Immutable.Set<MetaData>,
	) {
		if (!this._metaData) {
			this._metaData = Immutable.Set<MetaData>();
		}
	}

	get entityId(): number {
		return this._entityId;
	}

	get target(): number {
		return this._target;
	}

	get type(): BlockType {
		return this._blockType;
	}

	get triggerKeyword(): GameTag | null {
		return this._triggerKeyword;
	}

	get metaData(): Immutable.Set<MetaData> {
		return this._metaData;
	}
}
