import { describe, expect, it } from "vitest";
import Entity from "./Entity";
import * as Immutable from "immutable";
import { GameTag } from "./enums";

describe("Entity", () => {
	it("should save the entity id", () => {
		const entity = new Entity(1, Immutable.Map<string, number>());
		expect(entity.id).toBe(1);
	});

	it("should save an identical set of tags", () => {
		let tags = Immutable.Map<string, number>();
		tags = tags.set("" + GameTag.HEALTH, 42);
		const entity = new Entity(15, tags);
		expect(entity.getTags()).toBe(tags);
	});

	it("should not modify tags on card id change", () => {
		let tags = Immutable.Map<string, number>();
		tags = tags.set("" + GameTag.HEALTH, 42);
		let entity = new Entity(16, tags);
		entity = entity.setCardId("GVG_001");
		expect(entity.getTags()).toBe(tags);
	});

	it("should read weapon durability from DURABILITY in old replays", () => {
		const tags = Immutable.Map<string, number>().set(
			"" + GameTag.DURABILITY,
			3,
		);
		expect(new Entity(30, tags).getDurability()).toBe(3);
	});

	it("should read weapon durability from HEALTH in new replays", () => {
		const tags = Immutable.Map<string, number>().set(
			"" + GameTag.HEALTH,
			4,
		);
		expect(new Entity(31, tags).getDurability()).toBe(4);
	});

	it("should cast to string", () => {
		let entity = new Entity(21, Immutable.Map<string, number>());
		expect(entity.toString()).toEqual("Entity #21");
		entity = entity.setCardId("GVG_001");
		expect(entity.toString()).toEqual("Entity #21 (GVG_001)");
	});
});
