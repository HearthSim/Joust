import * as Immutable from "immutable";
import Player from "./Player";

describe("Player", () => {

	it("should cast to string", () => {
		let player = new Player(2, Immutable.Map<string, number>(), 1, "BehEh");
		expect(player.toString()).toEqual("Player #2 (playerId: 1, name: \"BehEh\")");
	});
});
