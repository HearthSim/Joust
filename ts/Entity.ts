import {GameTag} from './enums';
import {Rarity} from "./enums";

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

	public isRevealed():boolean {
		return !!this.cardId;
	}

	public getResourcesUsed():number {
		return this.getTag(GameTag.RESOURCES_USED);
	}

	public getResources():number {
		return this.getTag(GameTag.RESOURCES);
	}

	public isExhausted():boolean {
		return this.getTag(GameTag.EXHAUSTED) > 0;
	}

	public getDamage():number {
		return this.getTag(GameTag.DAMAGE);
	}

	public getHealth():number {
		return this.getTag(GameTag.HEALTH);
	}

	public getAtk():number {
		return this.getTag(GameTag.ATK);
	}

	public getArmor():number {
		return this.getTag(GameTag.ARMOR);
	}

	public getCost():number {
		return this.getTag(GameTag.COST);
	}

	public getZone():number {
		return this.getTag(GameTag.ZONE);
	}

	public getController():number {
		return this.getTag(GameTag.CONTROLLER);
	}

	public getDurability():number {
		return this.getTag(GameTag.DURABILITY);
	}

	public isLegendary():boolean {
		return this.getTag(GameTag.RARITY) === Rarity.LEGENDARY;
	}

	public isTaunter():boolean {
		return this.getTag(GameTag.TAUNT) > 0;
	}

	public isStealthed():boolean {
		return this.getTag(GameTag.STEALTH) > 0;
	}

	public isDivineShielded():boolean {
		return this.getTag(GameTag.DIVINE_SHIELD) > 0;
	}

	public getClass():number {
		return this.getTag(GameTag.CLASS);
	}

	public getCardType():number {
		return this.getTag(GameTag.CARDTYPE);
	}

	public isFrozen():boolean {
		return this.getTag(GameTag.FROZEN) > 0;
	}

	public getZonePosition():number {
		return this.getTag(GameTag.ZONE_POSITION);
	}

	public getDisplayedCreator():number {
		return this.getTag(GameTag.DISPLAYED_CREATOR);
	}

	public isPoweredUp():boolean {
		return this.getTag(GameTag.POWERED_UP) > 0;
	}

	public getTag(key:number):number {
		return this.tags ? (+this.tags.get('' + key) || 0) : 0;
	}

	public setTag(key:number, value:number):Entity {
		var strkey = '' + key;
		value = +value;
		// verify parameters
		if (strkey === null) {
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
				map.set(strkey, 0).delete(strkey);
			});
			if (tags.has(strkey)) {
				console.error('Entity could not remove tag ' + strkey + ' (it is still ' + tags.get(strkey) + ')');
			}
		}
		else {
			tags = tags.set(strkey, value);
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

export default Entity;
