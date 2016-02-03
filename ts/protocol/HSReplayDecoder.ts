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

class HSReplayDecoder extends Stream.Transform {

	private sax:Sax.SAXStream;
	private targetGame:number;
	private currentGame:number;
	private nodeStack;
	private timeOffset:number;
	private cardIds:Immutable.Map<number, String>;

	constructor(opts?:Stream.TransformOptions) {
		opts = opts || {};
		opts.objectMode = true;
		super(opts);

		this.currentGame = 0;
		this.targetGame = 0;
		this.nodeStack = [];
		this.timeOffset = null;
		this.cardIds = Immutable.Map<number, String>();

		this.sax = Sax.createStream(true, {});
		this.sax.on('opentag', this.onOpenTag.bind(this));
		this.sax.on('closetag', this.onCloseTag.bind(this));
	}

	_write(chunk:any, encoding:string, callback:Function):void {
		this.sax.write(chunk, encoding, callback);
	}

	_read(size:number):void {
		return;
	}

	/*protected revealHiddenInformation(stream:Stream.Readable, cb:() => void) {
	 var sax = Sax.createStream(true, {});
	 var game = 0;
	 sax.on('opentag', function (node) {
	 if (game > 1) {
	 return;
	 }
	 var id = null;
	 switch (node.name) {
	 case 'Game':
	 game++;
	 break;
	 case 'FullEntity':
	 id = +node.attributes.id;
	 case 'ShowEntity':
	 if (!id) {
	 id = +node.attributes.entity;
	 }
	 if (node.attributes.cardID) {
	 this.cardIds = this.cardIds.set(id, node.attributes.cardID);
	 }
	 break;
	 }
	 }.bind(this));
	 sax.on('end', function () {
	 console.debug("Revealing " + this.cardIds.count() + " entities in advance");
	 cb();
	 }.bind(this));
	 stream.pipe(sax);
	 }*/

	protected parseTimestamp(timestamp:string):number {
		if (timestamp.match(/^\d{2}:\d{2}:\d{2}/)) {
			// prepend a date
			timestamp = '1970-01-01T' + timestamp;
		}
		return new Date(timestamp).getTime();
	}

	private onOpenTag(node) {
		if (this.currentGame !== this.targetGame && node.name !== 'Game' && node.name !== 'HSReplay') {
			return;
		}
		switch (node.name) {
			case 'Game':
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

		/*var timestamp = node.attributes.ts && this.parseTimestamp(node.attributes.ts) || null;
		 if (timestamp !== null) {
		 if (this.timeOffset === null) {
		 this.timeOffset = timestamp;
		 }
		 timestamp -= this.timeOffset;
		 }*/

		this.nodeStack.push(node);
	}

	private onCloseTag(name) {
		//console.debug(Array(this.nodeStack.length).join('\t') + '</' + name + '>');

		if (this.currentGame !== this.targetGame && name !== 'Game') {
			return;
		}

		var node = this.nodeStack.pop();

		// sanity check for our stack
		if (node.name !== name) {
			console.error('Closing node did not match the opening node from stack (Stack: ' + node.name + ', Node: ' + name + ')');
			return;
		}

		var mutator = null;
		switch (name) {
			case 'Game':
				if (++this.currentGame > this.targetGame) {
					// we're done here
					return;
				}
				break;
			case 'GameEntity':
			case 'FullEntity':
			{
				let id = +node.attributes.id;
				let cardId = node.attributes.cardID;
				if (!cardId && this.cardIds.has(id)) {
					cardId = this.cardIds.get(id);
					console.debug('Revealing entity', id, 'as', cardId);
				}
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
				mutator = new ShowEntityMutator(
					+node.attributes.entity,
					node.attributes.cardID || null,
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
				mutator = new ClearOptionsMutator();
				break;
			default:
				//console.warn('Unknown HSReplay tag "' + node.name + '"');
				break;
		}

		if (mutator !== null) {
			// todo: set timestamp in mutator
			if (node.attributes.ts) {
				var timestamp = this.parseTimestamp(node.attributes.ts);
				if (timestamp) {
					mutator.time = timestamp;
				}
			}
			this.push(mutator);
		}
	}

}

export default HSReplayDecoder;