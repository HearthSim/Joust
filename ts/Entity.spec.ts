import Entity from "./Entity";
import * as Immutable from "immutable";

describe("Entity", () => {

	it('should save the entity id', () => {
		let entity = new Entity(1, Immutable.Map<string, number>());
		expect(entity.id).toBe(1);
	});

	it('should save an identical set of tags', () => {
		let tags = Immutable.Map<string, number>();
		tags = tags.set("tag", 42);
		let entity = new Entity(1, tags);
		expect(entity.getTags()).toBe(tags);
	});

	it('should not modify tags on card id change', () => {
		let tags = Immutable.Map<string, number>();
		tags = tags.set("tag", 42);
		let entity = new Entity(1, tags);
		entity = entity.setCardId("GVG_001");
		expect(entity.getTags()).toBe(tags);
	});
});
