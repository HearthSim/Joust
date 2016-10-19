import Entity from "./Entity";
import * as Immutable from "immutable";
import {GameTag, Zone, CardType, CardClass} from "./enums";
import TexturePreloader from "./TexturePreloader";

describe("TexturePreloader", () => {
	let texturePreloader = new TexturePreloader();

	describe("getAsset", () => {

		it("should return inhand assets", () => {
			expect(texturePreloader.getAsset(Zone.HAND, CardType.SPELL, CardClass.WARLOCK)).toEqual(["inhand_spell_warlock"]);
			expect(texturePreloader.getAsset(Zone.HAND, CardType.SPELL, CardClass.WARLOCK, true)).toEqual(["inhand_spell_warlock"]);
			expect(texturePreloader.getAsset(Zone.HAND, CardType.MINION, CardClass.MAGE)).toEqual(["inhand_minion_mage"]);
			expect(texturePreloader.getAsset(Zone.HAND, CardType.MINION, CardClass.MAGE, true)).toEqual(["inhand_minion_mage"]);
		});

		it("should return inhand assets in addition to inplay assets", () => {
			expect(texturePreloader.getAsset(Zone.PLAY, CardType.MINION, CardClass.WARRIOR, false)).toEqual(["inplay_minion_warrior", "inhand_minion_warrior"]);
			expect(texturePreloader.getAsset(Zone.PLAY, CardType.MINION, CardClass.WARRIOR, true)).toEqual(["inplay_minion_warrior", "inhand_minion_warrior"]);
		});

		it("should only return inhand for inplay spells", () => {
			expect(texturePreloader.getAsset(Zone.PLAY, CardType.SPELL, CardClass.WARLOCK, false)).toEqual(["inhand_spell_warlock"]);
			expect(texturePreloader.getAsset(Zone.PLAY, CardType.SPELL, CardClass.WARLOCK, true)).toEqual(["inhand_spell_warlock"]);
		});

		it("should return the correct inplay weapon asset", () => {
			expect(texturePreloader.getAsset(Zone.PLAY, CardType.WEAPON, CardClass.PALADIN)).toEqual(["inplay_weapon", "inplay_weapon_dome"]);
			expect(texturePreloader.getAsset(Zone.PLAY, CardType.WEAPON, CardClass.PALADIN, true)).toEqual(["inplay_weapon", "inplay_weapon_dome"]);
		});

		it("should return the correct inhand weapon asset", () => {
			expect(texturePreloader.getAsset(Zone.HAND, CardType.WEAPON, CardClass.PALADIN)).toEqual(["inhand_weapon_neutral"]);
			expect(texturePreloader.getAsset(Zone.HAND, CardType.WEAPON, CardClass.PALADIN, true)).toEqual(["inhand_weapon_premium"]);
		});

		it("should return null for invalid weapon assets", () => {
			expect(texturePreloader.getAsset(Zone.DECK, CardType.WEAPON, CardClass.PALADIN)).toEqual([]);
			expect(texturePreloader.getAsset(Zone.DISCARD, CardType.WEAPON, CardClass.PALADIN, true)).toEqual([]);
		});

		it("should not resolve invalid asset names", () => {
			expect(texturePreloader.getAsset(Zone.PLAY, CardType.TOKEN, CardClass.ROGUE)).toEqual([]);
			expect(texturePreloader.getAsset(Zone.HAND, CardType.ENCHANTMENT, CardClass.DRUID)).toEqual([]);
		});

	});
});
