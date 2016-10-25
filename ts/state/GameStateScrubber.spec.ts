import * as Immutable from "immutable";
import GameStateScrubber from "./GameStateScrubber";
import {GameTag, Step} from "../enums";
import Entity from "../Entity";
import GameState from "./GameState";

describe("GameStateScrubber", () => {

	let scrubber: GameStateScrubber;

	beforeEach(() => {
		scrubber = new GameStateScrubber();
	});

	it("should start paused", () => {
		expect(scrubber.isPaused()).toBeTruthy();
		expect(scrubber.isPlaying()).toBeFalsy();
	});

	it("should be interactable", () => {
		expect(scrubber.canInteract()).toBeFalsy();
		scrubber.play();
		expect(scrubber.isPlaying()).toBeTruthy();
		scrubber.pause();
		expect(scrubber.isPaused()).toBeTruthy();
		expect(scrubber.canInteract()).toBeTruthy();
	});

	describe("with the fixture", () => {
		const steps = [
			[1, Step.BEGIN_MULLIGAN],
			[1, Step.MAIN_READY],
			[1, Step.MAIN_START_TRIGGERS],
			[1, Step.MAIN_START],
			[1, Step.MAIN_ACTION],
			[1, Step.MAIN_END],
			[1, Step.MAIN_CLEANUP],
			[1, Step.MAIN_NEXT],
			[2, Step.MAIN_READY],
			[2, Step.MAIN_START_TRIGGERS],
			[2, Step.MAIN_START],
			[2, Step.MAIN_ACTION],
			[2, Step.MAIN_END],
			[2, Step.MAIN_CLEANUP],
			[2, Step.MAIN_NEXT],
			[2, Step.MAIN_READY],
		];

		let i = 0;
		const fixture = steps.map((entry) => {
			const [turn, step] = entry;
			return new GameState(Immutable.Map<number, Entity>().set(1, new Entity(1, Immutable.Map<number>({
				[GameTag.STEP]: step,
				[GameTag.TURN]: turn,
			}))), undefined, undefined, undefined, i++);
		});

		beforeEach(() => {
			console.log(steps);
			for (let state of fixture) {
				scrubber.push(state);
			}
		});

		it("should have two turns", () => {
			//expect(scrubber.getHistory().turnMap.count()).toBe(2);
		});

	});
});
