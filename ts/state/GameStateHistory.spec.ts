import GameStateHistory from "./GameStateHistory";
import GameState from "./GameState";
import Entity from "../Entity";
import * as Immutable from "immutable";

describe("GameStateHistory", () => {

	let history;
	let stateZero = new GameState(undefined, undefined, undefined, undefined, 0);
	let stateOne = new GameState(undefined, undefined, undefined, undefined, 1);
	let stateTwo = new GameState(undefined, undefined, undefined, undefined, 2);
	let stateFour = new GameState(undefined, undefined, undefined, undefined, 4);
	let stateTurnOne = new GameState(Immutable.Map<number, Entity>().set(1, new Entity(1, Immutable.Map<number>({19: 9, 20: 1}))), undefined, undefined, undefined, 20);
	let stateTurnOnePointFive = new GameState(Immutable.Map<number, Entity>().set(1, new Entity(1, Immutable.Map<number>({19: 9, 20: 1}))), undefined, undefined, undefined, 22);
	let stateTurnTwo = new GameState(Immutable.Map<number, Entity>().set(1, new Entity(1, Immutable.Map<number>({19: 9, 20: 2}))), undefined, undefined, undefined, 25);

	beforeEach(() => {
		history = new GameStateHistory();
	});

	it("should be initialized with an empty turn map", () => {
		expect(history.turnMap.count()).toBe(0);
	});

	it("should not add a state without turn to the turn map", () => {
		history.push(stateOne);
		expect(history.turnMap.count()).toBe(0);
	});

	it("should not add duplicate turns to the turn map", () => {
		history.push(stateTurnOne);
		expect(history.turnMap.count()).toBe(1);
		expect(history.turnMap.get(1)).toBe(stateTurnOne);
		history.push(stateTurnOnePointFive);
		expect(history.turnMap.count()).toBe(1);
		expect(history.turnMap.get(1)).toBe(stateTurnOne);
	});

	it("should add states with turn to the turn map", () => {
		history.push(stateTurnOne);
		expect(history.turnMap.count()).toBe(1);
		expect(history.turnMap.get(1)).toBe(stateTurnOne);
		history.push(stateTurnTwo);
		expect(history.turnMap.count()).toBe(2);
		expect(history.turnMap.get(2)).toBe(stateTurnTwo);
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
			expect(history.getLatest(0)).toBe(stateOne);
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
			expect(history.getLatest(10)).toBe(stateFour);
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
			expect(history.getLatest(10)).toBe(stateOne);
		});
	});
});
