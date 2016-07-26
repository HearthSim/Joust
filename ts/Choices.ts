import Choice from "./Choice";

class Choices {

	constructor(protected _choices:Immutable.Map<number, Choice>, protected _type:number) {
	}

	get choices():Immutable.Map<number, Choice> {
		return this._choices;
	}

	get type():number {
		return this._type;
	}
}

export default Choices;
