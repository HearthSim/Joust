'use strict';

class Option {
	protected index:number;
	protected type:number;
	protected entity:number;
	protected targets:number[];

	constructor(index:number, type:number, entity:number, targets:number[]) {
		this.index = index;
		this.type = type;
		this.entity = entity;
		this.targets = targets ? targets : [];
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

	public hasTargets():boolean {
		return this.targets.length > 0;
	}

	public getTargets():number[] {
		return this.targets;
	}
}

export = Option;