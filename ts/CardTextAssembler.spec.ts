import * as Immutable from "immutable";
import { CardData } from "hearthstonejson-client";
import {
	assembleCardText,
	getAssembledCardText,
	normalizeCardText,
	splitCardHalves,
	stripCardTextMarkers,
} from "./CardTextAssembler";
import Entity from "./Entity";
import { GameTag } from "./enums";

// cards as they appear in the metadata, including the "&" half delimiter
const TOLVIR_VANGUARD = {
	dbfId: 130567,
	text: "<b>Taunt</b>\n<b>Battlecry and Deathrattle:</b>&\n Gain 3 Armor.",
};
const AXE_OF_THE_FOREFATHERS = {
	dbfId: 119637,
	text: "After your hero attacks,& deal 1 damage to all minions.",
};
const PROTO_PANDAREN = {
	dbfId: 132135,
	text:
		"After a card enters your hand <i>except from this</i>,&\ngive both " +
		"players a random spell.~GAMEPLAY ASPROXY BE 997",
};

describe("stripCardTextMarkers", () => {
	it("should remove the half delimiter", () => {
		expect(stripCardTextMarkers(AXE_OF_THE_FOREFATHERS.text)).toEqual(
			"After your hero attacks, deal 1 damage to all minions.",
		);
	});

	it("should remove trailing gameplay metadata", () => {
		expect(stripCardTextMarkers(PROTO_PANDAREN.text)).toEqual(
			"After a card enters your hand <i>except from this</i>,\ngive " +
				"both players a random spell.",
		);
	});

	it("should leave regular card text alone", () => {
		expect(stripCardTextMarkers("<b>Taunt</b>")).toEqual("<b>Taunt</b>");
		expect(stripCardTextMarkers(undefined)).toEqual("");
	});
});

describe("normalizeCardText", () => {
	it("should drop alternate text variants", () => {
		expect(
			normalizeCardText("<b>Battlecry:</b> Deal 1 damage.@ <i>(@)</i>"),
		).toEqual("<b>Battlecry:</b> Deal 1 damage.");
	});

	it("should drop the manual line break flag", () => {
		expect(normalizeCardText("[x]<b>Taunt</b>")).toEqual("<b>Taunt</b>");
	});

	it("should handle missing text", () => {
		expect(normalizeCardText()).toEqual("");
	});
});

describe("splitCardHalves", () => {
	it("should split a trigger from an effect", () => {
		expect(splitCardHalves(TOLVIR_VANGUARD.text)).toEqual({
			first: "<b>Taunt</b>\n<b>Battlecry and Deathrattle:</b>",
			second: "Gain 3 Armor.",
			delimited: true,
		});
	});

	it("should split text that starts with the line break flag", () => {
		expect(
			splitCardHalves(
				"[x]At the end of your\nturn,& summon a 6/6\nElemental Dragon.",
			),
		).toEqual({
			first: "At the end of your\nturn,",
			second: "summon a 6/6\nElemental Dragon.",
			delimited: true,
		});
	});

	it("should treat undelimited text as either half", () => {
		expect(splitCardHalves("<b>Taunt</b>")).toEqual({
			first: "<b>Taunt</b>",
			second: "<b>Taunt</b>",
			delimited: false,
		});
	});
});

describe("assembleCardText", () => {
	it("should keep the first half and take the donated second half", () => {
		expect(
			assembleCardText(TOLVIR_VANGUARD, null, AXE_OF_THE_FOREFATHERS),
		).toEqual(
			"<b>Taunt</b>\n<b>Battlecry and Deathrattle:</b> deal 1 damage " +
				"to all minions.",
		);
	});

	it("should keep the second half and take the donated first half", () => {
		expect(
			assembleCardText(TOLVIR_VANGUARD, AXE_OF_THE_FOREFATHERS, null),
		).toEqual("After your hero attacks, Gain 3 Armor.");
	});

	it("should take both halves from the parts", () => {
		expect(
			assembleCardText(
				TOLVIR_VANGUARD,
				AXE_OF_THE_FOREFATHERS,
				PROTO_PANDAREN,
			),
		).toEqual("After your hero attacks, give both players a random spell.");
	});

	it("should not combine text from a build without the delimiter", () => {
		// metadata older than the mechanic: the halves are unknown, so the
		// card has to render as printed instead of as a mash-up
		expect(
			assembleCardText(
				{
					text:
						"The first time you deal damage each turn, gain +2 Attack.",
				},
				null,
				{
					text:
						"After you cast a Fire spell, get a random Elemental.",
				},
			),
		).toBeNull();
	});

	it("should return null without any text", () => {
		expect(assembleCardText({ text: "" })).toBeNull();
		expect(assembleCardText()).toBeNull();
	});
});

describe("getAssembledCardText", () => {
	const cards = Immutable.Map<number, CardData>([
		[AXE_OF_THE_FOREFATHERS.dbfId, AXE_OF_THE_FOREFATHERS],
		[PROTO_PANDAREN.dbfId, PROTO_PANDAREN],
	]);

	const entity = (tags: { [tag: number]: number }): Entity =>
		new Entity(
			94,
			Immutable.Map<string, number>(
				Object.keys(tags).map(
					(tag: string): [string, number] => [tag, tags[tag]],
				),
			),
			"BE_572",
		);

	const assembled = entity({
		[GameTag.CRAFTABLE_SECOND_HALF_DBID]: AXE_OF_THE_FOREFATHERS.dbfId,
	});

	it("should assemble from the part tag", () => {
		expect(getAssembledCardText(assembled, TOLVIR_VANGUARD, cards)).toEqual(
			"<b>Taunt</b>\n<b>Battlecry and Deathrattle:</b> deal 1 damage " +
				"to all minions.",
		);
	});

	it("should return null for an entity that was not assembled", () => {
		expect(
			getAssembledCardText(entity({}), TOLVIR_VANGUARD, cards),
		).toBeNull();
	});

	it("should ignore the marker set on cards offered as a part", () => {
		// the game sets the tag to 1 to mark which half a card would donate
		expect(
			getAssembledCardText(
				entity({
					[GameTag.CRAFTABLE_FIRST_HALF_DBID]: 1,
					[GameTag.CRAFTABLE_SECOND_HALF_DBID]: 1,
				}),
				TOLVIR_VANGUARD,
				cards,
			),
		).toBeNull();
	});

	it("should return null before metadata has loaded", () => {
		expect(
			getAssembledCardText(assembled, TOLVIR_VANGUARD, null),
		).toBeNull();
	});

	it("should return null for parts missing from the metadata", () => {
		expect(
			getAssembledCardText(
				entity({ [GameTag.CRAFTABLE_SECOND_HALF_DBID]: 404 }),
				TOLVIR_VANGUARD,
				cards,
			),
		).toBeNull();
	});
});
