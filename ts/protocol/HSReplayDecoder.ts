import SetChoicesMutator from "../state/mutators/SetChoicesMutator";
import * as Stream from "stream";
import * as Immutable from "immutable";
import TagChangeMutator from "../state/mutators/TagChangeMutator";
import AddEntityMutator from "../state/mutators/AddEntityMutator";
import Entity from "../Entity";
import Player from "../Player";
import { ChoiceType, GameTag } from "../enums";
import ShowEntityMutator from "../state/mutators/ShowEntityMutator";
import { CardOracle, MulliganOracle } from "../interfaces";
import Choice from "../Choice";
import { SAXStream } from "sax";
import ClearChoicesMutator from "../state/mutators/ClearChoicesMutator";
import Choices from "../Choices";
import GameStateDescriptor from "../state/GameStateDescriptor";
import PushDescriptorMutator from "../state/mutators/PushDescriptorMutator";
import PopDescriptorMutator from "../state/mutators/PopDescriptorMutator";
import EnrichDescriptorMutator from "../state/mutators/EnrichDescriptorMutator";
import MetaData from "../MetaData";
import GameStateMutator from "../state/GameStateMutator";
import { Tag } from "sax";
import HideEntityMutator from "../state/mutators/HideEntityMutator";

interface PlayerDetails {
	id: number;
	rank?: number;
	legendRank?: number;
}

export default class HSReplayDecoder extends Stream.Transform
	implements CardOracle, MulliganOracle {
	private sax: SAXStream;
	private gameId: number;
	private currentGame: number;
	private nodeStack: Tag[];
	private timeOffset: number;
	private cardIds: Immutable.Map<number, string>;
	private mulligans: Immutable.Map<number, boolean>;
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
		this.mulligans = Immutable.Map<number, boolean>();
		this.playerMap = Immutable.Map<string, PlayerDetails>();
		this.choiceMap = Immutable.Map<number, number>();
		this.build = null;
		this.debug = false;

		this.sax = new SAXStream(true, {});
		this.sax.on("opentag", this.onOpenTag.bind(this));
		this.sax.on("closetag", this.onCloseTag.bind(this));
		this.sax.on("error", (e: any) => this.emit("error", e));
		this.once("end", () => {
			this.sax.end();
		});
	}

	_transform(chunk: any, encoding: string, callback: Function): void {
		this.sax.write(chunk);
		callback();
	}

	protected parseTimestamp(timestamp: string): number {
		if (timestamp.match(/^\d{2}:\d{2}:\d{2}/)) {
			// prepend a date
			timestamp = "1970-01-01T" + timestamp;
		}
		return new Date(timestamp).getTime();
	}

	private onOpenTag(node: Tag): void {
		if (this.gameId !== null && this.gameId !== this.currentGame) {
			this.nodeStack.push(node);
			return;
		}

		switch (node.name) {
			case "Game":
				const gameId = node.attributes["id"];
				if (gameId) {
					this.gameId = +gameId;
					this.currentGame = +gameId;
				}
				break;
			case "GameEntity":
			case "Player":
			case "FullEntity":
			case "ShowEntity":
			case "ChangeEntity":
				node.attributes["tags"] = Immutable.Map<
					string,
					number
				>() as any;
				break;
			case "Choices":
			case "ChosenEntities":
			case "SendChoices":
				node.attributes["choices"] = Immutable.Map<
					string,
					Choice
				>() as any;
				break;
			case "HSReplay":
				this.version = node.attributes["version"];
				if (this.version) {
					if (!this.version.match(/^1\.[3-7](\.[0-9]+)?$/)) {
						console.warn(
							"HSReplay version",
							this.version,
							"is unsupported",
						);
					}
				} else {
					console.warn("Replay does not contain HSReplay version");
				}
				const build = node.attributes["build"];
				if (typeof build !== "undefined") {
					this.build = +build;
				}
				if (!this.build) {
					console.warn(
						"Replay does not contain Hearthstone build number",
					);
				}
				this.emit("build", this.build);
				break;
			case "Action":
			case "Block":
				// attach meta information to current game state
				const descriptor = new GameStateDescriptor(
					+node.attributes["entity"],
					+node.attributes["target"],
					+node.attributes["type"],
					+node.attributes["triggerKeyword"] || null,
				);
				node["descriptor"] = descriptor;
				this.push(new PushDescriptorMutator(descriptor));
				break;
			case "MetaData":
				node.attributes["entities"] = Immutable.Set<number>() as any;
				break;
		}

		this.nodeStack.push(node);
	}

	private onCloseTag(name: string): void {
		const node = this.nodeStack.pop() as any;

		// sanity check for our stack
		if (node.name !== name) {
			this.emit(
				"error",
				new Error(
					"HSReplay: Stack/Node missmatch (Stack: " +
						node.name +
						", Node: " +
						name +
						")",
				),
			);
			return;
		}

		if (this.gameId && this.gameId !== this.currentGame) {
			return;
		}

		let mutator: GameStateMutator = null;
		switch (name) {
			case "Game":
				if (this.currentGame === null) {
					// force termination
					this.gameId = 1;
				}
				break;
			case "GameEntity":
			case "FullEntity": {
				const id = this.resolveEntityId(node.attributes["id"]);
				const cardId = node.attributes["cardID"] || null;
				this.revealEntity(id, cardId);
				const entity = new Entity(
					id,
					node.attributes["tags"],
					cardId || null,
				);
				mutator = new AddEntityMutator(entity);
				break;
			}
			case "Player": {
				const id = +node.attributes["id"];
				let rank = +node.attributes["rank"];
				let legendRank = +node.attributes["legendRank"];
				let name = "" + node.attributes["name"];
				if (!name) {
					// this should only be happening in resumed replays
					this.playerMap.forEach((v: PlayerDetails, k: string) => {
						// find the old player name
						if (v.id === id) {
							console.warn(
								"Transferring player name",
								'"' + k + '"',
								"to entity #" + v.id,
							);
							name = k;
							rank = v.rank;
							legendRank = v.legendRank;
							return false;
						}
					});
				}
				this.playerMap = this.playerMap.set(name, {
					id,
					rank,
					legendRank,
				} as PlayerDetails);
				const player = new Player(
					id,
					node.attributes["tags"],
					+node.attributes["playerID"],
					name,
					rank,
					legendRank,
				);
				mutator = new AddEntityMutator(player);
				break;
			}
			case "ShowEntity":
			case "ChangeEntity": {
				const id = this.resolveEntityId(node.attributes["entity"]);
				const cardId = node.attributes["cardID"] || null;
				const tags = node.attributes["tags"];
				this.revealEntity(id, cardId, tags);
				mutator = new ShowEntityMutator(
					id,
					cardId,
					tags,
					name == "ChangeEntity",
				);
				break;
			}
			case "HideEntity":
				mutator = new HideEntityMutator(
					this.resolveEntityId(node.attributes["entity"]),
					+node.attributes["zone"],
				);
				break;
			case "Tag": {
				const parent = this.nodeStack.pop() as any;
				parent.attributes["tags"] = parent.attributes["tags"].set(
					"" + node.attributes["tag"],
					+node.attributes["value"],
				);
				this.nodeStack.push(parent);
				break;
			}
			case "TagChange":
				mutator = new TagChangeMutator(
					this.resolveEntityId(node.attributes["entity"]),
					+node.attributes["tag"],
					+node.attributes["value"],
				);
				break;
			case "Choice":
				{
					const parent = this.nodeStack.pop() as any;
					const entity =
						node.attributes["entity"] &&
						this.resolveEntityId(node.attributes["entity"]);
					const choice = new Choice(
						+node.attributes["index"],
						entity,
					);
					parent.attributes["choices"] = parent.attributes[
						"choices"
					].set(entity, choice);
					this.nodeStack.push(parent);
				}
				break;
			case "Choices":
				{
					const entity = this.resolveEntityId(
						node.attributes["entity"],
					);
					const type = +node.attributes["type"];
					const choices = new Choices(
						node.attributes["choices"],
						type,
					);
					mutator = new SetChoicesMutator(entity, choices);
					// save player entity in choice map
					this.choiceMap = this.choiceMap.set(
						+node.attributes["id"],
						entity,
					);
					// setup mulligans
					if (type === ChoiceType.MULLIGAN) {
						(node.attributes["choices"] as Immutable.Map<
							string,
							Choice
						>).forEach((choice: Choice) => {
							this.mulligans = this.mulligans.set(
								choice.entityId,
								true,
							);
						});
					}
				}
				break;
			case "ChosenEntities":
			case "SendChoices":
				let entity: number = null;
				let type = null;
				if (node.attributes["type"]) {
					type = node.attributes["type"];
				}
				if (node.attributes["entity"]) {
					entity =
						node.attributes["entity"] &&
						this.resolveEntityId(node.attributes["entity"]);
				} else if (node.attributes["id"]) {
					const id = +node.attributes["id"];
					if (this.choiceMap.has(id)) {
						entity = this.choiceMap.get(+node.attributes["id"]);
					}
				}
				if (entity !== null) {
					mutator = new ClearChoicesMutator(entity);
				}
				// we can't detect type here, so check the mulligan map
				(node.attributes["choices"] as Immutable.Map<
					string,
					Choice
				>).forEach((choice: Choice) => {
					if (this.mulligans.get(choice.entityId, null) === true) {
						this.mulligans = this.mulligans.set(
							choice.entityId,
							false,
						);
					}
					this.emit("mulligans", this.mulligans);
				});
				break;
			case "Action":
			case "Block":
				mutator = new PopDescriptorMutator();
				break;
			case "Info": {
				const parent = this.nodeStack.pop() as any;
				parent.attributes["entities"] = parent.attributes[
					"entities"
				].add(this.resolveEntityId(node.attributes["entity"]));
				this.nodeStack.push(parent);
				break;
			}
			case "MetaData":
				const meta = new MetaData(
					+node.attributes["meta"],
					+node.attributes["data"] || +node.attributes["entity"] || 0, // entity is pre-1.3
					node.attributes["entities"],
				);
				mutator = new EnrichDescriptorMutator(meta);
				break;
			case "Option":
			case "Options":
			case "Target":
			case "SendOption":
				// disabled while Hearthstone does not reliably clear them
				break;
			case "HSReplay":
			case "Deck":
			case "Card":
			case "SubOption":
				// unused
				break;
			default:
				// don't emit error event, since that would end the stream
				console.error(
					new Error('HSReplay: Unknown tag "' + node.name + '"'),
				);
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

		if (typeof id === "undefined") {
			console.warn("Cannot resolve missing entity id");
			return 0;
		}

		const str = "" + id;

		if (str === "UNKNOWN HUMAN PLAYER") {
			console.warn("Cannot resolve entity for " + str);
			return 0;
		}

		console.warn(
			"HSReplay: Using player names as entity reference is deprecated",
		);

		if (this.playerMap.has(str)) {
			id = this.playerMap.get(str).id;
		} else {
			console.warn('Could not resolve entity id "' + id + '"');
		}
		return +id;
	}

	protected revealEntity(
		id: number,
		cardId: string,
		tags?: Immutable.Map<string, number>,
	): void {
		if (!cardId || !id) {
			return;
		}
		id = +id;
		cardId = "" + cardId;
		if (this.cardIds.has(id)) {
			// do not overwrite entities
			return;
		}
		if (
			tags &&
			(tags.has("" + GameTag.SHIFTING) ||
				tags.has("" + GameTag.SHIFTING_MINION))
		) {
			cardId = "OG_123"; // Shifter Zerus
		}
		if (tags && tags.has("" + GameTag.SHIFTING_WEAPON)) {
			cardId = "UNG_929"; // Molten Blade
		}
		const newCardIds = this.cardIds.set(id, cardId);
		if (newCardIds === this.cardIds) {
			return;
		}
		this.cardIds = newCardIds;
		this.emit("cards", this.cardIds);
	}

	public getCardMap(): Immutable.Map<number, string> {
		return this.cardIds;
	}

	public getMulligans(): Immutable.Map<number, boolean> {
		return this.mulligans;
	}
}
