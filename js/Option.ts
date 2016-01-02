'use strict';

class Option {
	protected index:number;
	protected type:number;
	protected entity:number;

	constructor(index:number, type:number, entity:number) {
		this.index = index;
		this.type = type;
		this.entity = entity;
	}

	public getIndex():number {
		return this.index;
	}

	public getType():number {
		return this.type;
	}

	public getEntity():number {
		return this.entity;
	}
}

export = Option;