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

class HSReplayDecoder extends Stream.Transform implements CardOracle {

	private sax:Sax.SAXStream;
	private targetGame:number;
	private currentGame:number;
	private nodeStack;
	private timeOffset:number;
	private cardIds:Immutable.Map<number, string>;
	private clearOptionsOnTimestamp:boolean;

	constructor(opts?:Stream.TransformOptions) {
		opts = opts || {};
		opts.objectMode = true;
		super(opts);

		this.currentGame = -1;
		this.targetGame = 0;
		this.nodeStack = [];
		this.timeOffset = null;
		this.cardIds = Immutable.Map<number, string>();
		this.clearOptionsOnTimestamp = false;

		this.sax = Sax.createStream(true, {});
		this.sax.on('opentag', this.onOpenTag.bind(this));
		this.sax.on('closetag', this.onCloseTag.bind(this));
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
		if (this.currentGame > this.targetGame) {
			return;
		}

		switch (node.name) {
			case 'Game':
				this.currentGame++;
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
				var version = node.attributes.version;
				if (version) {
					if (version != '1.0') {
						console.warn('Unsupported HSReplay version', version, '(expected 1.0)');
					}
				}
				else {
					console.warn('Replay does not contain HSReplay version');
				}
				var build = node.attributes.build;
				if (!build) {
					console.warn('Replay does not contain Hearthstone build number');
				}
				break;
		}

		if (node.attributes.ts && this.currentGame === this.targetGame) {
			let timestamp = this.parseTimestamp(node.attributes.ts);
			if (timestamp) {
				if (this.clearOptionsOnTimestamp) {
					let clearMutator = new ClearOptionsMutator();
					clearMutator.time = timestamp;
					this.push(clearMutator);
					this.clearOptionsOnTimestamp = false;
				}
				else {
					this.push(new SetTimeMutator(timestamp));
				}
			}
		}

		this.nodeStack.push(node);
	}

	private onCloseTag(name) {
		//console.debug(Array(this.nodeStack.length).join('\t') + '</' + name + '>');

		if (this.currentGame > this.targetGame) {
			return;
		}

		var node = this.nodeStack.pop();

		// sanity check for our stack
		if (node.name !== name) {
			console.error("Closing node did not match the opening node from stack (Stack: " + node.name + ", Node: " + name + ")");
			return;
		}

		if (this.currentGame !== this.targetGame) {
			return;
		}

		var mutator = null;
		switch (name) {
			case 'Game':
			case 'GameEntity':
			case 'FullEntity':
			{
				let id = +node.attributes.id;
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
				let player = new Player(
					+node.attributes.id,
					node.attributes.tags,
					+node.attributes.playerID,
					node.attributes.name
				);
				mutator = new AddEntityMutator(player);
				break;
			case 'ShowEntity':
			{
				let id = +node.attributes.entity;
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
					+node.attributes.entity,
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
					+node.attributes.entity,
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
					+node.attributes.entity || null,
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

	protected revealEntity(id:number, cardId:string) {
		if (!cardId || !id) {
			return;
		}
		id = +id;
		cardId = '' + cardId;
		this.cardIds = this.cardIds.set(id, cardId);
	}


	public getCardMap() {
		return this.cardIds;
	}
}

export default HSReplayDecoder;