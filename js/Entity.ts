/// <reference path='../node_modules/immutable/dist/immutable.d.ts'/>
'use strict';

class Entity {
	constructor(protected id:number, protected tags:Immutable.Map<string, number>, protected cardId?:string) {
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

	public isExhausted():boolean {
		return this.getTag(43) > 0;
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

	public isStealthed():boolean {
		return this.getTag(191) === 1;
	}

	public isDivineShielded():boolean {
		return this.getTag(194) === 1;
	}

	public getClass():number {
		return this.getTag(199);
	}

	public getCardType():number {
		return this.getTag(202);
	}

	public getZonePosition():number {
		return this.getTag(263);
	}

	public isPoweredUp():boolean {
		return this.getTag(386) > 0;
	}

	public getTag(key:number|string):number {
		return this.tags ? (+this.tags.get('' + key) || 0) : 0;
	}

	public setTag(key:string, value:number):Entity {
		key = '' + key;
		value = +value;
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
			if (tags.has(key)) {
				console.error('Entity could not remove tag ' + key + ' (it is still ' + tags.get(key) + ')');
			}
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

	public setTags(tags:Immutable.Map<string, number>):Entity {
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
