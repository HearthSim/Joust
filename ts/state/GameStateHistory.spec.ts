import GameStateHistory from "./GameStateHistory";
import GameState from "./GameState";

describe("GameStateHistory", () => {

	var history;
	var stateZero = new GameState(undefined, undefined, undefined, undefined, 0);
	var stateOne = new GameState(undefined, undefined, undefined, undefined, 1);
	var stateTwo = new GameState(undefined, undefined, undefined, undefined, 2);
	var stateFour = new GameState(undefined, undefined, undefined, undefined, 4);

	beforeEach(() => {
		history = new GameStateHistory();
	});

	it("should be initialized with an empty list", () => {
		expect(history.turnMap.count()).toBe(0);
	});

	it("should set the first element as head", () => {
		history.push(stateOne);
		expect(history.head.state).toBe(stateOne);
	});

	it("should set the first element as tail", () => {
		history.push(stateOne);
		expect(history.tail.state).toBe(stateOne);
	});

	describe("with two states", () => {
		beforeEach(() => {
			history.push(stateOne);
			history.push(stateTwo);
		});

		it("should not have newer elements affect the tail", () => {
			expect(history.tail.state).toBe(stateOne);
		});

		it("should set a newer element as head", () => {
			expect(history.head.state).toBe(stateTwo);
		});

		it("should exactly fetch the latest element if possible", () => {
			expect(history.getLatest(1)).toBe(stateOne);
			expect(history.getLatest(2)).toBe(stateTwo);
		});

		it("should fetch the latest element", () => {
			expect(history.getLatest(1.5)).toBe(stateOne);
			expect(history.getLatest(1.99)).toBe(stateOne);
			expect(history.getLatest(3)).toBe(stateTwo);
		});

		it("should be clamped to the earliest state", () => {
			expect(history.getLatest(0.9)).toBe(stateOne);
		});
	});

	describe("with three states", () => {
		beforeEach(() => {
			history.push(stateOne);
			history.push(stateTwo);
			history.push(stateFour);
		});

		it("should fetch the latest element", () => {
			expect(history.getLatest(1.9)).toBe(stateOne);
			expect(history.getLatest(2)).toBe(stateTwo);
			expect(history.getLatest(3)).toBe(stateTwo);
			expect(history.getLatest(3.9)).toBe(stateTwo);
			expect(history.getLatest(4)).toBe(stateFour);
		});
	});

	describe("with a zero state", () => {
		beforeEach(() => {
			history.push(stateZero);
			history.push(stateOne);
		});

		it("should fetch the latest element", () => {
			expect(history.getLatest(0.9)).toBe(stateZero);
			expect(history.getLatest(1)).toBe(stateOne);
			expect(history.getLatest(1.1)).toBe(stateOne);
		});
	});
});
