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

	public isTarget(target:number):boolean {
		return this.targets.filter(function (proposedTarget) {
				return proposedTarget === target;
			}).length == 1;
	}

	public getTargets():number[] {
		return this.targets;
	}
}

export default Option;