import * as Immutable from "immutable";
import {MetaDataType} from "./enums";

class MetaData {
	constructor(private type: MetaDataType, private data: number, private entities?: Immutable.Set<number>) {
		if(!this.entities) {
			this.entities = Immutable.Set<number>();
		}
	}

	public getType(): MetaDataType {
		return this.type;
	}

	public getData(): number {
		return this.data;
	}

	public getEntities(): Immutable.Set<number> {
		return this.entities;
	}
}

export default MetaData;
