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
import {GameTag, PowSubType} from "../enums";
import ShowEntityMutator from "../state/mutators/ShowEntityMutator";
import SetTimeMutator from "../state/mutators/SetTimeMutator";
import {CardOracle} from "../interfaces";
import IncrementTimeMutator from "../state/mutators/IncrementTimeMutator";
import Choice from "../Choice";
import SetChoicesMutator from "../state/mutators/SetChoicesMutator";
import ClearChoicesMutator from "../state/mutators/ClearChoicesMutator";
import Choices from "../Choices";
import GameStateDescriptor from "../state/GameStateDescriptor";
import PushDescriptorMutator from "../state/mutators/PushDescriptorMutator";
import PopDescriptorMutator from "../state/mutators/PopDescriptorMutator";
import EnrichDescriptorMutator from "../state/mutators/EnrichDescriptorMutator";
import MetaData from "../MetaData";

interface PlayerDetails {
	id: number;
	rank?: number;
	legendRank?: number;
}

class HSReplayDecoder extends Stream.Transform implements CardOracle {

	private sax: Sax.SAXStream;
	private gameId: number;
	private currentGame: number;
	private nodeStack;
	private timeOffset: number;
	private cardIds: Immutable.Map<number, string>;
	private clearOptionsOnTimestamp: boolean;
	private playerMap: Immutable.Map<string, PlayerDetails>;
	private choiceMap: Immutable.Map<number, number>;
	public version: string;
	public build: number;
	public debug: boolean;

	constructor(opts?: Stream.TransformOptions) {
		opts = opts || {};
		opts.objectMode = true;
		super(opts);

		this.gameId = null;
		this.currentGame = null;
		this.nodeStack = [];
		this.timeOffset = null;
		this.cardIds = Immutable.Map<number, string>();
		this.clearOptionsOnTimestamp = false;
		this.playerMap = Immutable.Map<string, PlayerDetails>();
		this.choiceMap = Immutable.Map<number, number>();
		this.debug = false;

		this.sax = Sax.createStream(true, {});
		this.sax.on('opentag', this.onOpenTag.bind(this));
		this.sax.on('closetag', this.onCloseTag.bind(this));
		this.sax.on('error', (e) => {
			this.emit('error', e);
		});
		this.once('end', () => {
			this.sax.end()
		});
	}

	_transform(chunk: any, encoding: string, callback: Function): void {
		this.sax.write(chunk);
		callback();
	}

	protected parseTimestamp(timestamp: string): number {
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
			case 'ChangeEntity':
				node.attributes.tags = Immutable.Map<string, number>();
				break;
			case 'Option':
			case 'SubOption':
				node.attributes.targets = [];
				break;
			case 'Options':
				node.attributes.options = Immutable.Map<number, Option>();
				break;
			case 'Choices':
			case 'ChosenEntities':
			case 'SendChoices':
				node.attributes.choices = Immutable.Map<string, Choice>();
				break;
			case 'HSReplay':
				this.version = node.attributes.version;
				if (this.version) {
					if (!this.version.match(/^1\.3(\.[0-9]+)?$/)) {
						console.warn('HSReplay version', this.version, 'is unsupported');
					}
				}
				else {
					console.warn('Replay does not contain HSReplay version');
				}
				this.build = node.attributes.build;
				if (typeof this.build !== 'undefined') {
					this.build = +this.build;
				}
				if (!this.build) {
					console.warn('Replay does not contain Hearthstone build number');
				}
				this.emit('build', this.build);
				break;
			case 'Action':
			case 'Block':
				let type = +node.attributes.type;
				// attach meta information to current game state
				let descriptor = new GameStateDescriptor(
					+node.attributes.entity,
					+node.attributes.target,
					type
				);
				node.descriptor = descriptor;
				this.push(new IncrementTimeMutator());
				this.push(new PushDescriptorMutator(descriptor));
 				break;
			case 'MetaData':
				node.attributes.entities = Immutable.Set<number>();
				break;
		}

		this.nodeStack.push(node);
	}

	private onCloseTag(name) {

		var node = this.nodeStack.pop();

		// sanity check for our stack
		if (node.name !== name) {
			this.emit('error', new Error("HSReplay: Stack/Node missmatch (Stack: " + node.name + ", Node: " + name + ")"));
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
				// force checkpoint
				//this.push(new IncrementTimeMutator(0));
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
					let rank = +node.attributes.rank;
					let legendRank = +node.attributes.legendRank;
					let name = '' + node.attributes.name;
					if (!name) {
						// this should only be happening in resumed replays
						this.playerMap.forEach((v: PlayerDetails, k: string) => {
							// find the old player name
							if (v.id === id) {
								console.warn('Transferring player name', '"' + k + '"', 'to entity #' + v.id);
								name = k;
								rank = v.rank;
								legendRank = v.legendRank;
								return false;
							}
						});
					}
					this.playerMap = this.playerMap.set(name, <PlayerDetails>{ id: id, rank: rank, legendRank: legendRank });
					let player = new Player(
						id,
						node.attributes.tags,
						+node.attributes.playerID,
						name,
						rank,
						legendRank
					);
					mutator = new AddEntityMutator(player);
					break;
				}
			case 'ShowEntity':
			case 'ChangeEntity':
				{
					let id = this.resolveEntityId(node.attributes.entity);
					let cardId = node.attributes.cardID || null;
					this.revealEntity(id, cardId);
					mutator = new ShowEntityMutator(
						id,
						cardId,
						node.attributes.tags,
						name == 'ChangeEntity'
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
						node.attributes.targets
					);
					parent.attributes.options = parent.attributes.options.set(+node.attributes.index, option);
					this.nodeStack.push(parent);
				}
				break;
			case 'Target':
				{
					let parent = this.nodeStack.pop();
					parent.attributes.targets.push(this.resolveEntityId(node.attributes.entity));
					this.nodeStack.push(parent);
				}
				break;
			case 'Options':
				mutator = new SetOptionsMutator(node.attributes.options);
				break;
			case 'SendOption':
				this.push(new IncrementTimeMutator(2));
				mutator = new ClearOptionsMutator();
				break;
			case 'Choice':
				{
					let parent = this.nodeStack.pop();
					let entity = (node.attributes.entity && this.resolveEntityId(node.attributes.entity));
					let choice = new Choice(
						+node.attributes.index,
						entity
					);
					parent.attributes.choices = parent.attributes.choices.set(entity, choice);
					this.nodeStack.push(parent);
				}
				break;
			case 'Choices':
				{
					let entity = this.resolveEntityId(node.attributes.entity);
					let choices = new Choices(node.attributes.choices, +node.attributes.type);
					mutator = new SetChoicesMutator(
						entity,
						choices
					);
					// save player entity in choice map
					this.choiceMap = this.choiceMap.set(+node.attributes.id, entity);
				}
				break;
			case 'ChosenEntities':
			case 'SendChoices':
				this.push(new IncrementTimeMutator(2));
				let entity = null;
				if (node.attributes.entity) {
					entity = node.attributes.entity && this.resolveEntityId(node.attributes.entity);
				}
				else if (node.attributes.id) {
					let id = +node.attributes.id;
					if (this.choiceMap.has(id)) {
						entity = this.choiceMap.get(+node.attributes.id);
					}
				}
				if (entity !== null) {
					mutator = new ClearChoicesMutator(entity);
				}
				break;
			case 'Action':
			case 'Block':
				let pauses = [PowSubType.PLAY, PowSubType.TRIGGER, PowSubType.POWER, PowSubType.ATTACK];
				if (pauses.indexOf(+node.attributes.type) !== -1) {
					this.push(new IncrementTimeMutator());
				}
				this.push(new PopDescriptorMutator());
				break;
			case 'Info':
				{
					let parent = this.nodeStack.pop();
					parent.attributes.entities = parent.attributes.entities.add(this.resolveEntityId(node.attributes.entity));
					this.nodeStack.push(parent);
					break;
				}
			case 'MetaData':
				let meta = new MetaData(
					+node.attributes.meta,
					+node.attributes.data || +node.attributes.entity, // entity is pre-1.3
					node.attributes.entities
				);
				this.push(new EnrichDescriptorMutator(meta));
				break;
			case 'HSReplay':
			case 'Deck':
			case 'Card':
			case 'SubOption':
				// unused
				break;
			default:
				this.emit('error', new Error('HSReplay: Unknown tag "' + node.name + '"'));
				break;
		}

		if (mutator !== null) {
			this.push(mutator);
		}
	}

	protected resolveEntityId(id: number | string): number {
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
			id = this.playerMap.get(str).id;
		}
		else {
			console.warn('Could not resolve entity id "' + id + '"');
		}
		return +id;
	}

	protected revealEntity(id: number, cardId: string) {
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
