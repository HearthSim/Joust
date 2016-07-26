class Choice {
	constructor(protected _index: number, protected _entityId: number) {
	}

	get index(): number {
		return this._index;
	}

	get entityId(): number {
		return this._entityId;
	}
}

export default Choice;
