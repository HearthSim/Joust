import Choice from "./Choice";

class Choices {

	constructor(protected choices:Immutable.Map<number, Choice>, protected type:number) {
	}

	public getType():number {
		return this.type;
	}

	public getChoices():Immutable.Map<number, Choice> {
		return this.choices;
	}

}

export default Choices;
