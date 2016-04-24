import * as Stream from "stream";
import {CardData} from "./interfaces";
import Entity from "./Entity";

class TexturePreloader extends Stream.Writable {
	protected fired = {};
	protected textureQueue = ['GAME_005'];
	protected images = [];
	private working = 0;
	private assetCount = 0;
	private textureCount = 0;
	private heroPowerCount = 0;
	protected assetQueue = ['cardback', 'hero_frame', 'hero_power', 'inhand_minion', 'inhand_spell', 'inhand_weapon',
							'inhand_minion_legendary', 'mana_crystal', 'inplay_minion', 'effect_sleep',
							'hero_power_exhausted', 'hero_armor', 'hero_attack', 'icon_deathrattle', 'icon_inspire',
							'icon_poisonous', 'icon_trigger', 'inplay_minion_frozen', 'inplay_minion_legendary',
							'inplay_minion_taunt', 'inplay_weapon', 'inplay_weapon_dome'];

	constructor(public textureDirectory?: string, public assetDirectory?: string, public cards?: Immutable.Map<string, CardData>) {
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
			this.textureQueue.push(id);
			this.consume();
		}

		callback();
	}

	public consume() {
		// maximum number of parallel request
		if(this.working >= 1024) {
			return;
		}

		if((!this.textureDirectory || !this.cards || !this.textureQueue.length) && (!this.assetDirectory || !this.assetQueue.length)) {
			return;
		}

		this.working++;

		let next = () => {
			this.working--;
			this.consume();
		};

		let isAsset = false;
		let isHeroPower = false;
		let file = this.assetQueue.shift();
		if (!!this.assetDirectory && file) {
			file = this.assetDirectory + 'images/' + file + '.png';
			isAsset = true;
		}
		else {
			let cardId = this.textureQueue.shift();
			let card = this.cards.get(cardId);
			if (!card) {
				console.warn('No texture for ' + cardId + ' to preload');
				next();
				return;
			}
			isHeroPower = card.type == 'HERO_POWER'
			file = this.textureDirectory + card.texture + '.jpg';
		}

		if (this.fired[file]) {
			next();
			return;
		}

		this.fired[file] = true;

		let updateProgress = (asset: boolean, heroPower: boolean) => {
			if (asset) {
				this.assetCount++;
			}
			else {
				this.textureCount++;
				if (heroPower) {
					this.heroPowerCount++;
				}
			}
			next();
		};

		let image = new Image;
		image.onload =() => updateProgress(isAsset, isHeroPower);
		image.onerror = () => updateProgress(isAsset, isHeroPower);
		image.src = file;
		this.images[this.images.length] = image;

		// attempt next consumption immediately
		this.consume();
	}

	public canPreload(): boolean {
		return !!this.assetDirectory || !!this.textureDirectory;
	}

	public texturesReady(): boolean {
		return (this.textureCount > 20 || !this.working) && this.heroPowerCount > 1;
	}

	public assetsReady(): boolean {
		return this.assetCount > 10 || !this.working;
	}
}

export default TexturePreloader;
