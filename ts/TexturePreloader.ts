import * as Stream from "stream";
import {CardData} from "./interfaces";
import Entity from "./Entity";

class TexturePreloader extends Stream.Writable {
	protected fired = {};
	protected queue = ['GAME_005'];
	protected images = [];
	private working = 0;

	constructor(public textureDirectory?: string, public cards?: Immutable.Map<string, CardData>) {
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
			this.queue.push(id);
			this.consume();
		}

		callback();
	}

	public consume() {
		if(this.working >= 10) {
			return;
		}

		if(!this.textureDirectory || !this.cards || !this.queue.length) {
			return;
		}

		this.working++;

		let next = () => {
			this.working--;
			this.consume();
		};

		let cardId = this.queue.shift();

		if(!this.cards.get(cardId)) {
			console.warn('No texture for ' + cardId + ' to preload');
			next();
			return;
		}

		let texture = this.textureDirectory + this.cards.get(cardId).texture + '.jpg';

		if(this.fired[texture]) {
			next();
			return;
		}

		this.fired[texture] = true;

		let image = new Image;
		image.onload = next;
		image.onerror = next;
		image.src = texture;
		this.images[this.images.length] = image;

		// attempt next consumption
		this.consume();
	}
}

export default TexturePreloader;
