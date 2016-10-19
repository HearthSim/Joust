import * as _ from "lodash";
import * as Stream from "stream";
import {CardData} from "./interfaces";
import {CardClass, CardType, Zone} from "./enums";
import Entity from "./Entity";


export default class TexturePreloader extends Stream.Writable {
	protected fired = {};
	protected cardArtQueue: string[] = ['GAME_005'];
	protected images: HTMLImageElement[] = [];
	private working = 0;
	protected assetQueue = ['cardback', 'hero_frame', 'hero_power', 'inhand_mulligan',
		'inhand_minion_neutral', 'inhand_spell_neutral', 'inhand_weapon_neutral',
		'inhand_minion_legendary', 'mana_crystal', 'inplay_minion', 'effect_sleep',
		'hero_power_exhausted', 'hero_armor', 'hero_attack', 'icon_deathrattle', 'icon_inspire',
		'icon_poisonous', 'icon_trigger', 'inplay_minion_frozen', 'inplay_minion_legendary',
		'inplay_minion_taunt', 'inplay_minion_divine_shield', 'inplay_minion_stealth',
		'inplay_weapon', 'inplay_weapon_dome', 'healing', 'damage', 'skull',
		'inplay_hero_frozen', 'inplay_hero_immune', 'inplay_minion_buffed', 'inplay_minion_enraged',
		'inplay_minion_immune', 'inplay_minion_silenced', 'inplay_minion_untargetable'];

	constructor(public cardArt?: (cardId: string) => string, public assets?: (asset: string) => string) {
		super({objectMode: true});
		this.consume();
	}

	private _cardData: Immutable.Map<string, CardData>;

	public set cardData(cardData: Immutable.Map<string, CardData>) {
		this._cardData = cardData;
	}

	public get cardData(): Immutable.Map<string, CardData> {
		return this._cardData;
	}

	_write(chunk: any, encoding: string, callback: Function) {
		let mutator = (chunk as any);

		let id: string = null;

		if (mutator.entity) {
			let entity = mutator.entity as Entity;
			id = entity.cardId;
		}

		id = id || mutator.cardId;

		if (id) {
			this.cardArtQueue.push(id);
			this.consume();
		}

		callback();
	}

	public getAsset(zone: Zone, cardType: CardType, cardClass: CardClass, premium: boolean = false): string[] {
		let parts = [];
		if (zone === Zone.PLAY && cardType === CardType.SPELL) {
			zone = Zone.HAND;
		}
		parts.push(this.resolveZone(zone));
		parts.push(this.resolveCardType(cardType));
		if (cardType === CardType.WEAPON) {
			if (zone === Zone.HAND) {
				parts.push(premium ? "premium" : "neutral");
				return [parts.join("_")];
			}
			else if (zone === Zone.PLAY) {
				return [parts.join("_"), parts.concat("dome").join("_")];
			}
			return [];
		}
		parts.push(this.resolveCardClass(cardClass));
		if (_.includes(parts, null)) {
			return [];
		}
		let element = parts.join("_");
		if (zone === Zone.PLAY) {
			return [element].concat(this.getAsset(Zone.HAND, cardType, cardClass, premium));
		}
		return [element];
	}

	protected resolveZone(zone: Zone): string|null {
		switch (zone) {
			case Zone.HAND:
				return "inhand";
			case Zone.PLAY:
				return "inplay";
		}
		return null;
	}

	protected resolveCardType(cardType: CardType): string|null {
		switch (cardType) {
			case CardType.SPELL:
				return "spell";
			case CardType.MINION:
				return "minion";
			case CardType.WEAPON:
				return "weapon";
		}
		return null;
	}

	protected resolveCardClass(cardClass: CardClass): string|null {
		switch (cardClass) {
			case CardClass.DRUID:
				return "druid";
			case CardClass.HUNTER:
			case CardClass.DREAM:
				return "hunter";
			case CardClass.MAGE:
				return "mage";
			case CardClass.PALADIN:
				return "palading";
			case CardClass.PRIEST:
				return "priest";
			case CardClass.ROGUE:
				return "rogue";
			case CardClass.SHAMAN:
				return "shaman";
			case CardClass.WARLOCK:
				return "warlock";
			case CardClass.WARRIOR:
				return "warrior";
			case CardClass.NEUTRAL:
				return "neutral";
		}
		return null;
	}

	public consume() {
		// maximum number of parallel requests
		if (this.working >= 1024) {
			return;
		}

		if ((!this.cardArt || !this.cardArtQueue.length) && (!this.assets || !this.assetQueue.length)) {
			return;
		}

		this.working++;

		let next = () => {
			this.working--;
			this.consume();
		};

		let file = this.assetQueue.shift();
		if (!!this.assets && file) {
			file = this.assets("images/" + file + ".png");
		}
		else {
			let cardId = this.cardArtQueue.shift();
			file = this.cardArt(cardId);
		}

		if (this.fired[file]) {
			next();
			return;
		}

		this.fired[file] = true;

		let image = new Image;
		image.onload = next;
		image.onerror = next;
		image.src = file;
		this.images[this.images.length] = image;

		// attempt next consumption immediately
		this.consume();
	}
}
