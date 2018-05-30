import GameState from "../GameState";
import IncrementTimeMutator from "./IncrementTimeMutator";

describe("IncrementTimeMutator", () => {
	it("should have a default time increment of 1", () => {
		const mutator = new IncrementTimeMutator();
		expect(mutator.time).toEqual(1);
	});

	it("should save the time increment", () => {
		const expected = 42;
		const mutator = new IncrementTimeMutator(expected);
		expect(mutator.time).toEqual(expected);
	});

	it("should have a mutable time increment", () => {
		const mutator = new IncrementTimeMutator();
		const expected = 42;
		mutator.time = expected;
		expect(mutator.time).toEqual(expected);
	});

	it("should set the time of a new gamestate to 0", () => {
		const state = new GameState();
		const mutator = new IncrementTimeMutator(42);
		const expected = 0;
		expect(mutator.applyTo(state).time).toEqual(expected);
	});

	it("should increase the time of a gamestate by the time increment", () => {
		let state = new GameState();

		const mutator1 = new IncrementTimeMutator();
		const mutator2 = new IncrementTimeMutator(3);
		let expected = 0;

		state = state.apply(mutator1);
		expect(state.time).toEqual(expected);

		expected += mutator2.time;

		state = state.apply(mutator2);
		expect(state.time).toEqual(expected);
	});
});
