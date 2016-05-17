import {PowSubType} from "../enums";

class GameStateDescriptor {
	constructor(private entity: number, private target: number, private action: PowSubType) {

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
}

export default GameStateDescriptor;
