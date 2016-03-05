import IncrementTimeMutator from "./IncrementTimeMutator";
import GameState from "../GameState";

describe("IncrementTimeMutator", () => {

	it("should have a default time of 1", () => {
		let mutator = new IncrementTimeMutator();
		expect(mutator.time).toEqual(1);
	});

	it("should save the time to increment", () => {
		let mutator = new IncrementTimeMutator(42);
		expect(mutator.time).toEqual(42);
	});

	it("should have a mutable time", () => {
		let mutator = new IncrementTimeMutator(42);
		mutator.time = 1337;
		expect(mutator.time).toEqual(1337);
	});

	it("should set the time of a new gamestate to 1", () => {
		let mutator = new IncrementTimeMutator();
		let state = new GameState();
		expect(mutator.applyTo(state).getTime()).toEqual(1);
	});

	it("should set the time of a new gamestate to any value", () => {
		let mutator = new IncrementTimeMutator(42);
		let state = new GameState();
		expect(mutator.applyTo(state).getTime()).toEqual(42);
	});

	it("should increment the time of a gamestate by 1", () => {
		let mutator1 = new IncrementTimeMutator();
		let state = new GameState();
		state = state.apply(mutator1);
		expect(state.getTime()).toEqual(1);
		let mutator2 = new IncrementTimeMutator();
		state = state.apply(mutator1);
		expect(state.getTime()).toEqual(2);
	});

});
