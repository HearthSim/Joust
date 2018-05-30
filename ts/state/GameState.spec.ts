import GameState from "./GameState";

describe("GameState", () => {
	it("should start at time null", () => {
		const state = new GameState();
		expect(state.time).toBeNull();
	});
});
