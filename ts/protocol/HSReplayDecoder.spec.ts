import HSReplayDecoder from "./HSReplayDecoder";
import AddEntityMutator from "../state/mutators/AddEntityMutator";
import TagChangeMutator from "../state/mutators/TagChangeMutator";
import ShowEntityMutator from "../state/mutators/ShowEntityMutator";
import Player from "../Player";

describe("HSReplayDecoder", () => {

	var decoder;

	beforeEach(() => {
		decoder = new HSReplayDecoder();
	});

	afterEach(() => {
		decoder.end();
	});

	describe("AddEntityMutators", () => {

		it("should be emitted for FullEntity tags", (done) => {
			decoder.write('<FullEntity id="22" />');
			decoder.once('data', (mutator:AddEntityMutator) => {
				expect(mutator.entity.id).toBe(22);
				expect(mutator.entity.getTags().count()).toBe(0);
				done();
			})
		});

		it("should be emitted for GameEntity tags", (done) => {
			decoder.write('<GameEntity id="1" />');
			decoder.once('data', (mutator:AddEntityMutator) => {
				expect(mutator.entity.id).toBe(1);
				expect(mutator.entity.getTags().count()).toBe(0);
				done();
			})
		});

		it("should be emitted for Player tags", (done) => {
			decoder.write('<Player id="3" playerID="2" name="BehEh" rank="0" legendRank="5"></Player>');
			decoder.once('data', (mutator:AddEntityMutator) => {
				let player = mutator.entity as Player;
				expect(player.id).toBe(3);
				expect(player.playerId).toBe(2);
				expect(player.name).toBe("BehEh");
				expect(player.rank).toBe(0);
				expect(player.legendRank).toBe(5);
				done();
			})
		});

		it("should be emitted with the game tags", (done) => {
			decoder.write('<FullEntity id="4"><Tag tag="42" value="1337" /></FullEntity>');
			decoder.once('data', (mutator:AddEntityMutator) => {
				expect(mutator.entity.getTags().count()).toBe(1);
				expect(mutator.entity.getTag(42)).toBe(1337);
				done();
			})
		});

	});

	describe("TagChangeMutators", () => {

		it("should be emitted for TagChange tags", (done) => {
			decoder.write('<TagChange entity="10" tag="5" value="2" />');
			decoder.once('data', (mutator:TagChangeMutator) => {
				expect(mutator.id).toBe(10);
				expect(mutator.tag).toBe(5);
				expect(mutator.value).toBe(2);
				done();
			})
		});

	});

	describe("ShowEntityMutators", () => {

		it("should be emitted for ShowEntity tags", (done) => {
			decoder.write('<ShowEntity cardID="GVG_037" entity="12" />');
			decoder.once('data', (mutator:ShowEntityMutator) => {
				expect(mutator.cardId).toBe("GVG_037");
				expect(mutator.entityId).toBe(12);
				expect(mutator.tags.count()).toBe(0);
				expect(mutator.replaceTags).toBeFalsy();
				done();
			})
		});

		it("should be emitted for ChangeEntity tags", (done) => {
			decoder.write('<ChangeEntity cardID="CS2_231" entity="6" />');
			decoder.once('data', (mutator:ShowEntityMutator) => {
				expect(mutator.cardId).toBe("CS2_231");
				expect(mutator.entityId).toBe(6);
				expect(mutator.replaceTags).toBeTruthy();
				done();
			})
		});

		it("should be emitted with the game tags", (done) => {
			decoder.write('<ShowEntity cardID="OG_123" entity="12"><Tag tag="12" value="5" /></ShowEntity>');
			decoder.once('data', (mutator:ShowEntityMutator) => {
				expect(mutator.tags.count()).toBe(1);
				expect(mutator.tags.get("12")).toBe(5);
				done();
			})
		});

	});

});
