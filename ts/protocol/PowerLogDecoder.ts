import * as Stream from "stream";
import * as Immutable from "immutable";
import {CardOracle, MulliganOracle} from "../interfaces";
import * as byline from "byline";
import AddEntityMutator from "../state/mutators/AddEntityMutator";
import Entity from "../Entity";
import Player from "../Player";
import GameStateMutator from "../state/GameStateMutator";
import TagChangeMutator from "../state/mutators/TagChangeMutator";
import ShowEntityMutator from "../state/mutators/ShowEntityMutator";

const GAME_ENTITY = "GameEntity";
const INDENT_WIDTH = 4;

enum GameTag {
	IGNORE_DAMAGE = 1,
	TAG_SCRIPT_DATA_NUM_1 = 2,
	TAG_SCRIPT_DATA_NUM_2 = 3,
	TAG_SCRIPT_DATA_ENT_1 = 4,
	TAG_SCRIPT_DATA_ENT_2 = 5,
	MISSION_EVENT = 6,
	TIMEOUT = 7,
	TURN_START = 8,
	TURN_TIMER_SLUSH = 9,
	PREMIUM = 12,
	GOLD_REWARD_STATE = 13,
	PLAYSTATE = 17,
	LAST_AFFECTED_BY = 18,
	STEP = 19,
	TURN = 20,
	FATIGUE = 22,
	CURRENT_PLAYER = 23,
	FIRST_PLAYER = 24,
	RESOURCES_USED = 25,
	RESOURCES = 26,
	HERO_ENTITY = 27,
	MAXHANDSIZE = 28,
	STARTHANDSIZE = 29,
	PLAYER_ID = 30,
	TEAM_ID = 31,
	TRIGGER_VISUAL = 32,
	RECENTLY_ARRIVED = 33,
	PROTECTED = 34,
	PROTECTING = 35,
	DEFENDING = 36,
	PROPOSED_DEFENDER = 37,
	ATTACKING = 38,
	PROPOSED_ATTACKER = 39,
	ATTACHED = 40,
	EXHAUSTED = 43,
	DAMAGE = 44,
	HEALTH = 45,
	ATK = 47,
	COST = 48,
	ZONE = 49,
	CONTROLLER = 50,
	OWNER = 51,
	DEFINITION = 52,
	ENTITY_ID = 53,
	HISTORY_PROXY = 54,
	COPY_DEATHRATTLE = 55,
	COPY_DEATHRATTLE_INDEX = 56,
	ELITE = 114,
	MAXRESOURCES = 176,
	CARD_SET = 183,
	CARDTEXT_INHAND = 184,
	CARDNAME = 185,
	CARD_ID = 186,
	DURABILITY = 187,
	SILENCED = 188,
	WINDFURY = 189,
	TAUNT = 190,
	STEALTH = 191,
	SPELLPOWER = 192,
	DIVINE_SHIELD = 194,
	CHARGE = 197,
	NEXT_STEP = 198,
	CLASS = 199,
	CARDRACE = 200,
	FACTION = 201,
	CARDTYPE = 202,
	RARITY = 203,
	STATE = 204,
	SUMMONED = 205,
	FREEZE = 208,
	ENRAGED = 212,
	RECALL = 215,
	OVERLOAD = 215,
	LOYALTY = 216,
	DEATH_RATTLE = 217,
	DEATHRATTLE = 217,
	BATTLECRY = 218,
	SECRET = 219,
	COMBO = 220,
	CANT_HEAL = 221,
	CANT_DAMAGE = 222,
	CANT_SET_ASIDE = 223,
	CANT_REMOVE_FROM_GAME = 224,
	CANT_READY = 225,
	CANT_EXHAUST = 226,
	CANT_ATTACK = 227,
	CANT_TARGET = 228,
	CANT_DESTROY = 229,
	CANT_DISCARD = 230,
	CANT_PLAY = 231,
	CANT_DRAW = 232,
	INCOMING_HEALING_MULTIPLIER = 233,
	INCOMING_HEALING_ADJUSTMENT = 234,
	INCOMING_HEALING_CAP = 235,
	INCOMING_DAMAGE_MULTIPLIER = 236,
	INCOMING_DAMAGE_ADJUSTMENT = 237,
	INCOMING_DAMAGE_CAP = 238,
	CANT_BE_HEALED = 239,
	CANT_BE_DAMAGED = 240,
	IMMUNE = 240,
	CANT_BE_SET_ASIDE = 241,
	CANT_BE_REMOVED_FROM_GAME = 242,
	CANT_BE_READIED = 243,
	CANT_BE_EXHAUSTED = 244,
	CANT_BE_ATTACKED = 245,
	CANT_BE_TARGETED = 246,
	CANT_BE_DESTROYED = 247,
	AttackVisualType = 251,
	CardTextInPlay = 252,
	CANT_BE_SUMMONING_SICK = 253,
	FROZEN = 260,
	JUST_PLAYED = 261,
	LINKED_ENTITY = 262,
	LINKEDCARD = 262,
	ZONE_POSITION = 263,
	CANT_BE_FROZEN = 264,
	COMBO_ACTIVE = 266,
	CARD_TARGET = 267,
	DevState = 268,
	NUM_CARDS_PLAYED_THIS_TURN = 269,
	CANT_BE_TARGETED_BY_OPPONENTS = 270,
	NUM_TURNS_IN_PLAY = 271,
	NUM_TURNS_LEFT = 272,
	OUTGOING_DAMAGE_CAP = 273,
	OUTGOING_DAMAGE_ADJUSTMENT = 274,
	OUTGOING_DAMAGE_MULTIPLIER = 275,
	OUTGOING_HEALING_CAP = 276,
	OUTGOING_HEALING_ADJUSTMENT = 277,
	OUTGOING_HEALING_MULTIPLIER = 278,
	INCOMING_ABILITY_DAMAGE_ADJUSTMENT = 279,
	INCOMING_COMBAT_DAMAGE_ADJUSTMENT = 280,
	OUTGOING_ABILITY_DAMAGE_ADJUSTMENT = 281,
	OUTGOING_COMBAT_DAMAGE_ADJUSTMENT = 282,
	OUTGOING_ABILITY_DAMAGE_MULTIPLIER = 283,
	OUTGOING_ABILITY_DAMAGE_CAP = 284,
	INCOMING_ABILITY_DAMAGE_MULTIPLIER = 285,
	INCOMING_ABILITY_DAMAGE_CAP = 286,
	OUTGOING_COMBAT_DAMAGE_MULTIPLIER = 287,
	OUTGOING_COMBAT_DAMAGE_CAP = 288,
	INCOMING_COMBAT_DAMAGE_MULTIPLIER = 289,
	INCOMING_COMBAT_DAMAGE_CAP = 290,
	CURRENT_SPELLPOWER = 291,
	ARMOR = 292,
	MORPH = 293,
	IS_MORPHED = 294,
	TEMP_RESOURCES = 295,
	RECALL_OWED = 296,
	OVERLOAD_OWED = 296,
	NUM_ATTACKS_THIS_TURN = 297,
	NEXT_ALLY_BUFF = 302,
	MAGNET = 303,
	FIRST_CARD_PLAYED_THIS_TURN = 304,
	MULLIGAN_STATE = 305,
	TAUNT_READY = 306,
	STEALTH_READY = 307,
	CHARGE_READY = 308,
	CANT_BE_TARGETED_BY_SPELLS = 311,
	CANT_BE_TARGETED_BY_ABILITIES = 311,
	SHOULDEXITCOMBAT = 312,
	CREATOR = 313,
	DIVINE_SHIELD_READY = 314,
	CANT_BE_DISPELLED = 314,
	CANT_BE_SILENCED = 314,
	PARENT_CARD = 316,
	NUM_MINIONS_PLAYED_THIS_TURN = 317,
	PREDAMAGE = 318,
	Collectible = 321,
	TARGETING_ARROW_TEXT = 325,
	ENCHANTMENT_BIRTH_VISUAL = 330,
	ENCHANTMENT_IDLE_VISUAL = 331,
	CANT_BE_TARGETED_BY_HERO_POWERS = 332,
	WEAPON = 334,
	InvisibleDeathrattle = 335,
	HEALTH_MINIMUM = 337,
	TAG_ONE_TURN_EFFECT = 338,
	OneTurnEffect = 338,
	SILENCE = 339,
	COUNTER = 340,
	ARTISTNAME = 342,
	LocalizationNotes = 344,
	HAND_REVEALED = 348,
	ImmuneToSpellpower = 349,
	ADJACENT_BUFF = 350,
	FLAVORTEXT = 351,
	FORCED_PLAY = 352,
	LOW_HEALTH_THRESHOLD = 353,
	IGNORE_DAMAGE_OFF = 354,
	GrantCharge = 355,
	SPELLPOWER_DOUBLE = 356,
	HEALING_DOUBLE = 357,
	NUM_OPTIONS_PLAYED_THIS_TURN = 358,
	NUM_OPTIONS = 359,
	TO_BE_DESTROYED = 360,
	HealTarget = 361,
	AURA = 362,
	POISONOUS = 363,
	HOW_TO_EARN = 364,
	HOW_TO_EARN_GOLDEN = 365,
	TAG_HERO_POWER_DOUBLE = 366,
	HERO_POWER_DOUBLE = 366,
	AI_MUST_PLAY = 367,
	TAG_AI_MUST_PLAY = 367,
	NUM_MINIONS_PLAYER_KILLED_THIS_TURN = 368,
	NUM_MINIONS_KILLED_THIS_TURN = 369,
	AFFECTED_BY_SPELL_POWER = 370,
	EXTRA_DEATHRATTLES = 371,
	START_WITH_1_HEALTH = 372,
	IMMUNE_WHILE_ATTACKING = 373,
	MULTIPLY_HERO_DAMAGE = 374,
	MULTIPLY_BUFF_VALUE = 375,
	CUSTOM_KEYWORD_EFFECT = 376,
	TOPDECK = 377,
	CANT_BE_TARGETED_BY_BATTLECRIES = 379,
	SHOWN_HERO_POWER = 380,
	OVERKILL = 380,
	DEATHRATTLE_SENDS_BACK_TO_DECK = 382,
	DEATHRATTLE_RETURN_ZONE = 382,
	STEADY_SHOT_CAN_TARGET = 383,
	DISPLAYED_CREATOR = 385,
	POWERED_UP = 386,
	SPARE_PART = 388,
	FORGETFUL = 389,
	CAN_SUMMON_MAXPLUSONE_MINION = 390,
	OBFUSCATED = 391,
	BURNING = 392,
	OVERLOAD_LOCKED = 393,
	NUM_TIMES_HERO_POWER_USED_THIS_GAME = 394,
	CURRENT_HEROPOWER_DAMAGE_BONUS = 395,
	HEROPOWER_DAMAGE = 396,
	LAST_CARD_PLAYED = 397,
	NUM_FRIENDLY_MINIONS_THAT_DIED_THIS_TURN = 398,
	NUM_CARDS_DRAWN_THIS_TURN = 399,
	AI_ONE_SHOT_KILL = 400,
	EVIL_GLOW = 401,
	HIDE_STATS = 402,
	HIDE_COST = 402,
	INSPIRE = 403,
	RECEIVES_DOUBLE_SPELLDAMAGE_BONUS = 404,
	HEROPOWER_ADDITIONAL_ACTIVATIONS = 405,
	HEROPOWER_ACTIVATIONS_THIS_TURN = 406,
	REVEALED = 410,
	NUM_FRIENDLY_MINIONS_THAT_DIED_THIS_GAME = 412,
	CANNOT_ATTACK_HEROES = 413,
	LOCK_AND_LOAD = 414,
	TREASURE = 415,
	DISCOVER = 415,
	SHADOWFORM = 416,
	NUM_FRIENDLY_MINIONS_THAT_ATTACKED_THIS_TURN = 417,
	NUM_RESOURCES_SPENT_THIS_GAME = 418,
	CHOOSE_BOTH = 419,
	ELECTRIC_CHARGE_LEVEL = 420,
	HEAVILY_ARMORED = 421,
	DONT_SHOW_IMMUNE = 422,
	RITUAL = 424,
	PREHEALING = 425,
	APPEAR_FUNCTIONALLY_DEAD = 426,
	OVERLOAD_THIS_GAME = 427,
	SPELLS_COST_HEALTH = 431,
	HISTORY_PROXY_NO_BIG_CARD = 432,
	PROXY_CTHUN = 434,
	TRANSFORMED_FROM_CARD = 435,
	CTHUN = 436,
	CAST_RANDOM_SPELLS = 437,
	SHIFTING = 438,
	EMBRACE_THE_SHADOW = 442,
	CHOOSE_ONE = 443,
	EXTRA_ATTACKS_THIS_TURN = 444,
	SEEN_CTHUN = 445,
	MINION_TYPE_REFERENCE = 447,
	UNTOUCHABLE = 448,
	SCORE_LABELID_1 = 450,
	SCORE_VALUE_1 = 451,
	SCORE_LABELID_2 = 452,
	SCORE_VALUE_2 = 453,
	SCORE_LABELID_3 = 454,
	SCORE_VALUE_3 = 455,
	CANT_BE_FATIGUED = 456,
	AUTOATTACK = 457,
	TAG_LAST_KNOWN_COST_IN_HAND = 466,
}

enum Zone {
	DISCARD = -2,
	INVALID = 0,
	PLAY = 1,
	DECK = 2,
	HAND = 3,
	GRAVEYARD = 4,
	REMOVEDFROMGAME = 5,
	SETASIDE = 6,
	SECRET = 7,
}

enum CardType {
	INVALID = 0,
	GAME = 1,
	PLAYER = 2,
	HERO = 3,
	MINION = 4,
	SPELL = 5,
	ABILITY = 5,
	ENCHANTMENT = 6,
	WEAPON = 7,
	ITEM = 8,
	TOKEN = 9,
	HERO_POWER = 10,
}

enum Step {
	INVALID = 0,
	BEGIN_FIRST = 1,
	BEGIN_SHUFFLE = 2,
	BEGIN_DRAW = 3,
	BEGIN_MULLIGAN = 4,
	MAIN_BEGIN = 5,
	MAIN_READY = 6,
	MAIN_RESOURCE = 7,
	MAIN_DRAW = 8,
	MAIN_START = 9,
	MAIN_ACTION = 10,
	MAIN_COMBAT = 11,
	MAIN_END = 12,
	MAIN_NEXT = 13,
	FINAL_WRAPUP = 14,
	FINAL_GAMEOVER = 15,
	MAIN_CLEANUP = 16,
	MAIN_START_TRIGGERS = 17,
}

/**
 * Parses a Hearthstone Power.log and emits mutators.
 * @deprecated This decoder is for reference only and may be incomplete. Use HSReplayDecoder instead.
 */
export default class PowerLogDecoder extends Stream.Transform implements CardOracle, MulliganOracle {
	public cardIds: Immutable.Map<number, string>;
	public mulligans: Immutable.Map<number, boolean>;
	private stream: Stream.Duplex;
	private stack: string[];
	private mutator: GameStateMutator;
	private gameEntity: number;

	constructor(opts?: Stream.TransformOptions) {
		opts = opts || {};
		opts.objectMode = true;
		super(opts);

		this.mulligans = Immutable.Map<number, boolean>();
		this.cardIds = Immutable.Map<number, string>();

		this.stream = byline.createStream();
		this.stream.on("readable", () => {
			let line;
			while (null !== (line = this.stream.read())) {
				this.onLine("" + line);
			}
		});

		this.stack = [];
		this.gameEntity = null;
	}

	_transform(chunk: any, encoding: string, callback: Function): void {
		// passthrough
		this.stream.write(chunk, callback);
	}

	private onLine(timestampedLine: string): void {
		// extract timestamp
		let matches = null;
		if (!(matches = timestampedLine.match(/^(D|W) ([\d:.]+) (.+)$/))) {
			this.emit("error", new Error('Failed to parse timestamped line "' + timestampedLine + '"'));
			return;
		}
		let timestamp = matches[2];
		let line = matches[3];

		// parse logger and command
		matches = null;
		if (!(matches = line.match(/^(.*?) - (.*)$/))) {
			this.emit("error", new Error('Failed to parse line "' + line + '"'));
			return;
		}
		let logger = matches[1].trim();
		let command = matches[2];

		// calculate command depth
		matches = null;
		matches = command.match(/^(\W*).*$/);
		let depth = matches[1].length / INDENT_WIDTH;

		command = command.trim(); // clean up the command

		if (depth > this.stack.length) {
			this.stack.push(command);
		}
		else if (depth < this.stack.length) {
			this.stack.pop();
			this.submitMutator();
		}

		switch (logger) {
			case "GameState.DebugPrintPower()":
				this.onGameStateDebugPrintPower(command, depth);
				break;
			case "GameState.DebugPrintEntityChoices()":
			case "GameState.DebugPrintEntitiesChosen()":
			case "GameState.DebugPrintOptions()":
			case "GameState.DebugPrintPowerList()":
			case "GameState.SendOption()":
			case "GameState.SendChoices()":
			case "PowerTaskList.DebugPrintPower()":
			case "PowerTaskList.DebugDump()":
			case "PowerProcessor.PrepareHistoryForCurrentTaskList()":
			case "PowerProcessor.DoTaskListForCard()":
			case "PowerProcessor.EndCurrentTaskList()":
				break;
			default:
				this.emit("error", new Error('Unknown logger "' + logger + '" ("' + command + '")'));
				break;
		}
	}

	private onGameStateDebugPrintPower(command: string, depth: number) {
		let matches = null;
		let emptyTags = Immutable.Map<string, number>();
		if (matches = command.match(/^GameEntity EntityID=(\d)+/)) {
			let id = +matches[1];
			this.gameEntity = id;
			this.registerEntity(new Entity(id, emptyTags));
		}
		else if (matches = command.match(/^Player EntityID=(\d+) PlayerID=(\d+)/)) {
			let id = +matches[1];
			let playerId = +matches[2];
			this.registerEntity(new Player(id, emptyTags, playerId, "Player"));
		}
		else if (matches = command.match(/^FULL_ENTITY - Creating ID=(\d+) CardID=(\w*)/)) {
			let id = +matches[1];
			let cardId = matches[2];
			this.registerEntity(new Entity(id, emptyTags, cardId));
		}
		else if (matches = command.match(/^tag=(\w*) value=(\w*)$/)) {
			let tag = this.getTag(matches[1]);
			let value = this.getTagValue(tag, matches[2], matches[1]);
			this.registerTag(tag, value);
		}
		else if (matches = command.match(/^TAG_CHANGE Entity=(\w*|(\[.*\])) tag=(\w*) value=(\w*)$/)) {
			let id = this.resolveEntity(matches[1]);
			let tag = this.getTag(matches[3]);
			let value = this.getTagValue(tag, matches[4], matches[3]);
			this.push(new TagChangeMutator(id, tag, value));
		}
		else if (matches = command.match(/^SHOW_ENTITY - Updating Entity=(\w*|(\[.*\])) CardID=(\w*)$/)) {
			let id = this.resolveEntity(matches[1]);
			let cardId = matches[3];
			this.submitMutator();
			this.cardIds = this.cardIds.set(id, cardId);
			this.emit("cards", this.cardIds);
			this.mutator = new ShowEntityMutator(id, cardId, emptyTags);
		}
		else {
			//console.debug('Not yet implemented; "' + command + '", at depth ' + depth);
		}
	}

	private submitMutator(): void {
		if (!this.mutator) {
			return;
		}
		this.push(this.mutator);
		this.mutator = null;
	}

	private registerEntity(entity: Entity) {
		this.submitMutator();
		this.mutator = new AddEntityMutator(entity);
	}

	private registerTag(tag: number, value: number) {
		if (this.mutator instanceof AddEntityMutator) {
			let mutator = this.mutator as AddEntityMutator;
			mutator.entity = mutator.entity.setTag(tag, value);
		}
		if (this.mutator instanceof ShowEntityMutator) {
			let mutator = this.mutator as ShowEntityMutator;
			mutator.tags = mutator.tags.set("" + tag, value);
		}
	}

	private getTag(tag: string): number {
		return GameTag[tag];
	}

	private getTagValue(tag: number, value: any, tagName?: string): number {
		switch (tag) {
			case GameTag.ZONE:
				value = Zone[value];
				break;
			case GameTag.CARDTYPE:
				value = CardType[value];
				break;
			case GameTag.STEP:
			case GameTag.NEXT_STEP:
				value = Step[value];
				break;
		}

		if (isNaN(+value)) {
			console.warn("Tag not implemented: " + tagName + "." + value);
			value = 0;
		}

		return +value;
	}

	private resolveEntity(entity: any): number {
		if (!isNaN(+entity)) {
			return +entity;
		}

		let matches = null;
		if (matches = entity.match(/\[.*id=(\d+).*\]/)) {
			return +matches[1];
		}

		if (entity === GAME_ENTITY) {
			return this.gameEntity;
		}

		if (entity === "BehEh") {
			return 2;
		}

		if (entity === "Keks") {
			return 3;
		}

		this.emit("error", 'Could not resolve entity "' + entity + '"');

		return NaN;
	}

	public getCardMap(): Immutable.Map<number, string> {
		return this.cardIds;
	}

	public getMulligans(): Immutable.Map<number, boolean> {
		return this.mulligans;
	}
}
