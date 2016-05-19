import * as Stream from "stream";
import {CardData} from "./interfaces";
import Entity from "./Entity";

class CardArtPreloader extends Stream.Writable {
	protected fired = {};
	protected cardArtQueue = ['GAME_005'];
	protected images = [];
	private working = 0;
	protected assetQueue = ['cardback', 'hero_frame', 'hero_power', 'inhand_minion', 'inhand_spell', 'inhand_weapon',
							'inhand_minion_legendary', 'mana_crystal', 'inplay_minion', 'effect_sleep',
							'hero_power_exhausted', 'hero_armor', 'hero_attack', 'icon_deathrattle', 'icon_inspire',
							'icon_poisonous', 'icon_trigger', 'inplay_minion_frozen', 'inplay_minion_legendary',
							'inplay_minion_taunt', 'inplay_minion_divine_shield', 'inplay_weapon', 'inplay_weapon_dome'];

	constructor(public cardArtDirectory?: string, public assetDirectory?: string) {
		super({objectMode: true});
		this.consume();
	}

	_write(chunk: any, encoding: string, callback: Function) {
		let mutator = (chunk as any);

		let id = undefined;

		if(mutator.entity) {
			let entity = mutator.entity as Entity;
			id = entity.getCardId();
		}

		id = id || mutator.cardId;

		if(id) {
			this.cardArtQueue.push(id);
			this.consume();
		}

		callback();
	}

	public consume() {
		// maximum number of parallel request
		if(this.working >= 1024) {
			return;
		}

		if((!this.cardArtDirectory || !this.cardArtQueue.length) && (!this.assetDirectory || !this.assetQueue.length)) {
			return;
		}

		this.working++;

		let next = () => {
			this.working--;
			this.consume();
		};

		let file = this.assetQueue.shift();
		if (!!this.assetDirectory && file) {
			file = this.assetDirectory + 'images/' + file + '.png';
		}
		else {
			let cardId = this.cardArtQueue.shift();
			file = this.cardArtDirectory + cardId + '.jpg';
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

	public canPreload(): boolean {
		return !!this.assetDirectory || !!this.cardArtDirectory;
	}
}

export default CardArtPreloader;
