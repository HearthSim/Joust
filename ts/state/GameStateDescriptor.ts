import * as Immutable from "immutable";
import {PowSubType} from "../enums";
import MetaData from "../MetaData";

class GameStateDescriptor {

	constructor(private entity: number, private target: number, private action: PowSubType, private metaData?: Immutable.Set<MetaData>) {
		if(!this.metaData) {
			this.metaData = Immutable.Set<MetaData>();
		}
	}

	public getEntity(): number {
		return this.entity;
	}

	public getTarget(): number {
		return this.target;
	}

	public getType(): PowSubType {
		return this.action;
	}

	public getMetaData(): Immutable.Set<MetaData> {
		return this.metaData;
	}
}

export default GameStateDescriptor;
