import { afterEach, beforeEach, describe, expect, it } from "vitest";
import HSReplayDecoder from "./HSReplayDecoder";
import Player from "../Player";
import AddEntityMutator from "../state/mutators/AddEntityMutator";
import ClearChoicesMutator from "../state/mutators/ClearChoicesMutator";
import SetChoicesMutator from "../state/mutators/SetChoicesMutator";
import ShowEntityMutator from "../state/mutators/ShowEntityMutator";
import TagChangeMutator from "../state/mutators/TagChangeMutator";
import { GameTag } from "../enums";

describe("HSReplayDecoder", () => {
	let decoder;

	const next = (event: string) =>
		new Promise<any>((resolve) => decoder.once(event, resolve));

	beforeEach(() => {
		decoder = new HSReplayDecoder();
	});

	afterEach(() => {
		decoder.end();
		decoder = null;
	});

	describe("AddEntityMutators", () => {
		it("should be emitted for FullEntity tags", async () => {
			const data = next("data");
			decoder.write('<FullEntity id="22" />');
			const mutator: AddEntityMutator = await data;
			expect(mutator).toEqual(expect.any(AddEntityMutator));
			expect(mutator.entity).toBeDefined();
			expect(mutator.entity.id).toBe(22);
			expect(mutator.entity.getTags().count()).toBe(0);
		});

		it("should be emitted for GameEntity tags", async () => {
			const data = next("data");
			decoder.write('<GameEntity id="1" />');
			const mutator: AddEntityMutator = await data;
			expect(mutator.entity.id).toBe(1);
			expect(mutator.entity.getTags().count()).toBe(0);
		});

		it("should be emitted for Player tags", async () => {
			const data = next("data");
			decoder.write(
				'<Player id="3" playerID="2" name="BehEh" rank="0" legendRank="5"></Player>',
			);
			const mutator: AddEntityMutator = await data;
			const player = mutator.entity as Player;
			expect(player.id).toBe(3);
			expect(player.playerId).toBe(2);
			expect(player.name).toBe("BehEh");
			expect(player.rank).toBe(0);
			expect(player.legendRank).toBe(5);
		});

		it("should be emitted with the game tags", async () => {
			const data = next("data");
			decoder.write(
				'<FullEntity id="4"><Tag tag="42" value="1337" /></FullEntity>',
			);
			const mutator: AddEntityMutator = await data;
			expect(mutator.entity.getTags().count()).toBe(1);
			expect(mutator.entity.getTag(42)).toBe(1337);
		});
	});

	describe("TagChangeMutators", () => {
		it("should be emitted for TagChange tags", async () => {
			const data = next("data");
			decoder.write('<TagChange entity="10" tag="5" value="2" />');
			const mutator: TagChangeMutator = await data;
			expect(mutator).toEqual(expect.any(TagChangeMutator));
			expect(mutator.id).toBe(10);
			expect(mutator.tag).toBe(5);
			expect(mutator.value).toBe(2);
		});
	});

	describe("ShowEntityMutators", () => {
		it("should be emitted for ShowEntity tags", async () => {
			const data = next("data");
			decoder.write('<ShowEntity cardID="GVG_037" entity="12" />');
			const mutator: ShowEntityMutator = await data;
			expect(mutator).toEqual(expect.any(ShowEntityMutator));
			expect(mutator.cardId).toBe("GVG_037");
			expect(mutator.entityId).toBe(12);
			expect(mutator.tags.count()).toBe(0);
			expect(mutator.replaceTags).toBeFalsy();
		});

		it("should be emitted for ChangeEntity tags", async () => {
			const data = next("data");
			decoder.write('<ChangeEntity cardID="CS2_231" entity="6" />');
			const mutator: ShowEntityMutator = await data;
			expect(mutator).toEqual(expect.any(ShowEntityMutator));
			expect(mutator.cardId).toBe("CS2_231");
			expect(mutator.entityId).toBe(6);
			expect(mutator.replaceTags).toBeTruthy();
		});

		it("should be emitted with the game tags", async () => {
			const data = next("data");
			decoder.write(
				'<ShowEntity cardID="OG_123" entity="12"><Tag tag="12" value="5" /></ShowEntity>',
			);
			const mutator: ShowEntityMutator = await data;
			expect(mutator).toEqual(expect.any(ShowEntityMutator));
			expect(mutator.tags).toBeDefined();
			expect(mutator.tags.count()).toBe(1);
			expect(mutator.tags.get("12")).toBe(5);
		});
	});

	describe("CardOracle", () => {
		it("should remember the card id and assembled halves of a revealed entity", async () => {
			const cards = next("cards");
			decoder.write(
				'<ShowEntity cardID="TLC_100" entity="12">' +
					'<Tag tag="12" value="5" />' +
					`<Tag tag="${
						GameTag.CRAFTABLE_FIRST_HALF_DBID
					}" value="117027" />` +
					`<Tag tag="${
						GameTag.CRAFTABLE_SECOND_HALF_DBID
					}" value="121051" />` +
					"</ShowEntity>",
			);
			await cards;
			expect(decoder.getCardMap().get(12)).toBe("TLC_100");
			expect(
				decoder
					.getOracleTags()
					.get(12)
					.toJS(),
			).toEqual({
				[GameTag.CRAFTABLE_FIRST_HALF_DBID]: 117027,
				[GameTag.CRAFTABLE_SECOND_HALF_DBID]: 121051,
			});
		});

		it("should not remember tags for entities revealed without halves", async () => {
			const cards = next("cards");
			decoder.write(
				'<ShowEntity cardID="OG_123" entity="12"><Tag tag="12" value="5" /></ShowEntity>',
			);
			await cards;
			expect(decoder.getCardMap().get(12)).toBe("OG_123");
			expect(decoder.getOracleTags().has(12)).toBe(false);
		});
	});

	describe("SetChoicesMutators", () => {
		it("should be emitted for Mulligan Choices tags", async () => {
			const data = next("data");
			decoder.write(
				'<Choices entity="2" id="1" max="3" min="0" source="1" taskList="4" type="1">' +
					'<Choice entity="19" index="0" /><Choice entity="16" index="1" /><Choice entity="30" index="2" />' +
					"</Choices>",
			);
			const mutator: SetChoicesMutator = await data;
			expect(mutator).toEqual(expect.any(SetChoicesMutator));
			const choices = mutator.choices;
			expect(choices.type).toBe(1);
			expect(mutator.choices).toBeDefined();
			const collection = choices.choices;
			expect(collection.get(19).entityId).toBe(19);
			expect(collection.get(19).index).toBe(0);
			expect(collection.get(16).entityId).toBe(16);
			expect(collection.get(16).index).toBe(1);
			expect(collection.get(30).entityId).toBe(30);
			expect(collection.get(30).index).toBe(2);
		});
	});

	describe("ClearChoicesMutators", () => {
		it("should be emitted for ChosenEntities tags", async () => {
			const data = next("data");
			decoder.write(
				'<ChosenEntities entity="2" id="2"><Choice entity="42" index="0" /></ChosenEntities>',
			);
			const mutator: ClearChoicesMutator = await data;
			expect(mutator).toEqual(expect.any(ClearChoicesMutator));
			expect(mutator.player).toBe(2);
		});

		it("should be emitted for SendChoices tags", async () => {
			const data = next("data");
			decoder.write(
				'<SendChoices entity="3" id="1" type="1"><Choice entity="16" index="0" /></SendChoices>',
			);
			const mutator: ClearChoicesMutator = await data;
			expect(mutator).toEqual(expect.any(ClearChoicesMutator));
			expect(mutator.player).toBe(3);
		});
	});
});
