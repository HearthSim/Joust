import * as Stream from "stream";
import * as Sax from "sax";
import * as Immutable from "immutable";
import SetOptionsMutator from "../state/mutators/SetOptionsMutator";
import ClearOptionsMutator from "../state/mutators/ClearOptionsMutator";
import TagChangeMutator from "../state/mutators/TagChangeMutator";
import ReplaceEntityMutator from "../state/mutators/ReplaceEntityMutator";
import AddEntityMutator from "../state/mutators/AddEntityMutator";
import Option from "../Option";
import Entity from "../Entity";
import Player from "../Player";
import {GameTag} from "../enums";
import ShowEntityMutator from "../state/mutators/ShowEntityMutator";
import SetTimeMutator from "../state/mutators/SetTimeMutator";
import {CardOracle} from "../interfaces";
import IncrementTimeMutator from "../state/mutators/IncrementTimeMutator";

class HSReplayDecoder extends Stream.Transform implements CardOracle {

	private sax:Sax.SAXStream;
	private gameId:number;
	private currentGame:number;
	private nodeStack;
	private timeOffset:number;
	private cardIds:Immutable.Map<number, string>;
	private clearOptionsOnTimestamp:boolean;
	private playerMap:Immutable.Map<string, number>;
	public version:string;
	public build:number;

	constructor(opts?:Stream.TransformOptions) {
		opts = opts || {};
		opts.objectMode = true;
		super(opts);

		this.gameId = null;
		this.currentGame = null;
		this.nodeStack = [];
		this.timeOffset = null;
		this.cardIds = Immutable.Map<number, string>();
		this.clearOptionsOnTimestamp = false;
		this.playerMap = Immutable.Map<string, number>();

		this.sax = Sax.createStream(true, {});
		this.sax.on('opentag', this.onOpenTag.bind(this));
		this.sax.on('closetag', this.onCloseTag.bind(this));
		this.once('end', () => {
			this.sax.end()
		});
	}

	_transform(chunk:any, encoding:string, callback:Function):void {
		this.sax.write(chunk);
		callback();
	}

	protected parseTimestamp(timestamp:string):number {
		if (timestamp.match(/^\d{2}:\d{2}:\d{2}/)) {
			// prepend a date
			timestamp = '1970-01-01T' + timestamp;
		}
		return new Date(timestamp).getTime();
	}

	private onOpenTag(node) {
		if (this.gameId !== null && this.gameId !== this.currentGame) {
			this.nodeStack.push(node);
			return;
		}

		switch (node.name) {
			case 'Game':
				let gameId = node.attributes.id;
				if (gameId) {
					this.gameId = gameId;
					this.currentGame = gameId;
				}
				break;
			case 'GameEntity':
			case 'Player':
			case 'FullEntity':
			case 'ShowEntity':
				node.attributes.tags = Immutable.Map<string, number>();
				break;
			case 'Options':
				node.attributes.options = Immutable.Map<string, Option>();
				break;
			case 'HSReplay':
				this.version = node.attributes.version;
				if (this.version) {
					if (this.version == '1.1') {
						console.debug('HSReplay at version', this.version);
					}
					else if (this.version == '1.0') {
						console.warn('HSReplay version', this.version, 'is obsolete');
					}
					else {
						console.warn('HSReplay version', this.version, 'is possibly unsupported');
					}
				}
				else {
					console.warn('No HSReplay version found');
				}
				this.build = node.attributes.build;
				if (typeof this.build !== 'undefined') {
					this.build = +this.build;
				}
				if (!this.build) {
					console.warn('No Hearthstone build number found');
				}
				break;
			case 'Action':
				this.push(new IncrementTimeMutator());
				if (this.clearOptionsOnTimestamp) {
					this.clearOptionsOnTimestamp = false;
					this.push(new ClearOptionsMutator());
				}
				break;
		}

		this.nodeStack.push(node);
	}

	private onCloseTag(name) {

		var node = this.nodeStack.pop();

		// sanity check for our stack
		if (node.name !== name) {
			console.error("Closing node did not match the opening node from stack (Stack: " + node.name + ", Node: " + name + ")");
			return;
		}

		if (this.gameId && this.gameId !== this.currentGame) {
			return;
		}

		var mutator = null;
		switch (name) {
			case 'Game':
				if (this.currentGame === null) {
					// force termination
					this.gameId = 1;
				}
				break;
			case 'GameEntity':
			case 'FullEntity':
			{
				let id = this.resolveEntityId(node.attributes.id);
				let cardId = node.attributes.cardID || null;
				this.revealEntity(id, cardId);
				let entity = new Entity(
					id,
					node.attributes.tags,
					cardId || null
				);
				mutator = new AddEntityMutator(entity);
				break;
			}
			case 'Player':
			{
				let id = +node.attributes.id;
				let name = '' + node.attributes.name;
				if (!name && this.playerMap.includes(id)) {
					// this should only be happening in resumed replays
					this.playerMap.forEach((v:number, k:string):boolean => {
						// find the old player name
						if (v === id) {
							console.warn('Transferring player name', '"' + k + '"', 'to entity #' + v);
							name = k;
							return false;
						}
					});
				}
				this.playerMap = this.playerMap.set(name, id);
				let player = new Player(
					id,
					node.attributes.tags,
					+node.attributes.playerID,
					name
				);
				mutator = new AddEntityMutator(player);
				break;
			}
			case 'ShowEntity':
			{
				let id = this.resolveEntityId(node.attributes.entity);
				let cardId = node.attributes.cardID || null;
				this.revealEntity(id, cardId);
				mutator = new ShowEntityMutator(
					id,
					cardId,
					node.attributes.tags
				);
				break;
			}
			case 'HideEntity':
				mutator = new TagChangeMutator(
					this.resolveEntityId(node.attributes.entity),
					GameTag.ZONE, // zone
					+node.attributes.zone
				);
				break;
			case 'Tag':
			{
				let parent = this.nodeStack.pop();
				parent.attributes.tags = parent.attributes.tags.set('' + node.attributes.tag, +node.attributes.value);
				this.nodeStack.push(parent);
				break;
			}
			case 'TagChange':
				mutator = new TagChangeMutator(
					this.resolveEntityId(node.attributes.entity),
					+node.attributes.tag,
					+node.attributes.value
				);
				break;
			case 'Option':
			{
				let parent = this.nodeStack.pop();
				let option = new Option(
					+node.attributes.index,
					+node.attributes.type,
					(node.attributes.entity && this.resolveEntityId(node.attributes.entity)) || null,
					[] // todo: parse targets
				);
				parent.attributes.options = parent.attributes.options.set(+node.attributes.index, option);
				this.nodeStack.push(parent);
				break;
			}
			case 'Options':
				mutator = new SetOptionsMutator(node.attributes.options);
				break;
			case 'SendOption':
				// SendOption usually doesn't have a timestamp:
				// if we ClearOptions here, we won't see any options at all
				this.clearOptionsOnTimestamp = true;
				break;
			default:
				//console.warn('Unknown HSReplay tag "' + node.name + '"');
				break;
		}

		if (mutator !== null) {
			this.push(mutator);
		}
	}

	protected resolveEntityId(id:number|string):number {
		if (!isNaN(+id)) {
			return +id;
		}

		var str = '' + id;

		if (str === 'UNKNOWN HUMAN PLAYER') {
			console.warn('Cannot resolve entity for ' + str);
			return;
		}

		console.warn('HSReplay: Using player names as entity reference is deprecated');

		if (this.playerMap.has(str)) {
			id = this.playerMap.get(str);
		}
		else {
			console.warn('Could not resolve entity id "' + id + '"');
		}
		return +id;
	}

	protected revealEntity(id:number, cardId:string) {
		if (!cardId || !id) {
			return;
		}
		id = +id;
		cardId = '' + cardId;
		let newCardIds = this.cardIds.set(id, cardId);
		if (newCardIds === this.cardIds) {
			return;
		}
		this.cardIds = newCardIds;
		this.emit('cards', this.cardIds);
	}


	public getCardMap() {
		return this.cardIds;
	}
}

export default HSReplayDecoder;