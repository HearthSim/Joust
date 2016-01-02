/// <reference path='../node_modules/immutable/dist/immutable.d.ts'/>
'use strict';

class Entity {
	constructor(protected id:number, protected tags:Immutable.Map<number, number>, protected cardId?:string) {
	}

	protected factory(tags, cardId):Entity {
		return new Entity(this.id, tags, cardId);
	}

	public getId():number {
		return this.id;
	}

	public getCardId():string {
		return this.cardId;
	}

	public getDamage():number {
		return this.getTag(44);
	}

	public getHealth():number {
		return this.getTag(45);
	}

	public getAtk():number {
		return this.getTag(47);
	}

	public getCost():number {
		return this.getTag(48);
	}

	public getZone():number {
		return this.getTag(49);
	}

	public getController():number {
		return this.getTag(50);
	}

	public getDurability():number {
		return this.getTag(187);
	}

	public getCardType():number {
		return this.getTag(202);
	}

	public getZonePosition():number {
		return this.getTag(263);
	}

	public getTag(key:number) {
		return this.tags ? (this.tags.toJS()[key] || 0) : 0;
	}

	public setTag(key:number, value:number):Entity {
		// verify parameters
		if (key === null) {
			console.warn('Cannot set invalid tag on entity #' + this.getId());
			return this;
		}
		if (value === null) {
			value = 0;
		}

		var tags = this.tags;

		// delete value 0 tags
		if (value === 0) {
			tags = tags.withMutations(function (map) {
				// set to 0 to ensure it is really deleted
				map.set(key, 0).delete(key);
			});
		}
		else {
			tags = tags.set(key, value);
		}

		// verify tags have actually changed
		if (tags === this.tags) {
			return this;
		}

		return this.factory(tags, this.cardId);
	}

	public getTags() {
		return this.tags;
	}

	public setTags(tags:Immutable.Map<number, number>):Entity {
		var mergedTags = this.tags.merge(tags);
		if (mergedTags === this.tags) {
			return this;
		}

		return this.factory(mergedTags, this.cardId);
	}

	public setCardId(cardId:string):Entity {
		return this.factory(this.tags, cardId);
	}
}

export = Entity;
