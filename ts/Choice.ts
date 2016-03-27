class Choice {
	protected index: number;
	protected entity: number;

	constructor(index: number, entity: number) {
		this.index = index;
		this.entity = entity;
	}

	public getIndex(): number {
		return this.index;
	}

	public getEntity(): number {
		return this.entity;
	}
}

export default Choice;
