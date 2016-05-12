import * as React from "react";
import GameStateHistory from "../state/GameStateHistory";
import GameStateScrubber from "../state/GameStateScrubber";
import {StreamScrubberInhibitor} from "../interfaces";
import GameState from "../state/GameState";
import Turn from "./Turn";

interface TimelineProps extends React.Props<any> {
	at: number;
	duration: number;
	seek: (time: number) => void;
	turnMap?: Immutable.Map<number, GameState>;
	swapPlayers?: boolean;
}

interface TimelineState {
	isDragging?: boolean;
}

class Timeline extends React.Component<TimelineProps, TimelineState> implements StreamScrubberInhibitor {
	private ref: HTMLDivElement;
	private mouseMove: (e) => void;
	private mouseUp: (e) => void;
	private touchMove: (e) => void;
	private touchEnd: (e) => void;

	constructor(props: TimelineProps) {
		super(props);
		this.state = {
			isDragging: false
		};
		this.mouseMove = this.onMouseMove.bind(this);
		this.mouseUp = this.onMouseUp.bind(this);
		this.touchMove = this.onTouchMove.bind(this);
	}

	public componentDidMount(): void {
		document.addEventListener('mousemove', this.mouseMove);
		document.addEventListener('mouseup', this.mouseUp);
		document.addEventListener('touchmove', this.touchMove);
		document.addEventListener('touchend', this.mouseUp);
		document.addEventListener('touchcancel', this.mouseUp);
	}

	public componentWillUnmount(): void {
		document.removeEventListener('mousemove', this.mouseMove);
		document.removeEventListener('mouseup', this.mouseUp);
		document.removeEventListener('touchmove', this.touchMove);
		document.removeEventListener('touchend', this.mouseUp);
		document.removeEventListener('touchcancel', this.mouseUp);
	}

	protected onMouseDown(e): void {
		if (e.button !== 0) {
			// any button other than left click
			return;
		}
		e.preventDefault();
		this.setState({ isDragging: true });
		this.seek(e.clientX);
	}

	protected onMouseMove(e): void {
		if (!this.state.isDragging) {
			return;
		}

		if (!e.buttons) {
			this.setState({ isDragging: false });
			return;
		}

		this.seek(e.clientX);
	}

	protected onMouseUp(e): void {
		this.setState({ isDragging: false });
	}

	protected onTouchStart(e): void {
		if (!e.touches[0]) {
			return;
		}
		e.preventDefault();
		let touch = e.touches[0];
		this.setState({ isDragging: true });
		this.seek(touch.clientX);
	}

	protected onTouchMove(e): void {
		if (!this.state.isDragging) {
			return;
		}

		if (!e.touches[0]) {
			return;
		}

		e.preventDefault();
		let touch = e.touches[0];
		this.seek(touch.clientX);
	}

	protected seek(x: number): void {
		var rect = this.ref.getBoundingClientRect();
		var offset = Math.min(Math.max(rect.left, x), rect.right);

		var width = rect.right - rect.left;
		offset = offset - rect.left;

		var seek = this.props.duration / width * offset;
		this.props.seek(seek);
	}


	public render(): JSX.Element {
		let mulligan = this.props.turnMap.has(1) ?
			<Turn key={0}
				mulligan={true}
				duration={this.props.turnMap.get(1).getTime() }
				totalDuration={this.props.duration}
				/> : null;

		let turns = this.props.turnMap.map((current: GameState, turn: number, map: Immutable.Map<number, GameState>): JSX.Element => {
			let duration = 0;
			let i = 1;
			while (!map.has(turn + i) && turn + i < map.count()) {
				i++;
			}

			if (map.has(turn + i)) {
				let next = map.get(turn + i);
				duration = next.getTime() - current.getTime();
			}
			else {
				duration = this.props.duration - current.getTime();
			}

			return <Turn key={turn} state={current} invert={this.props.swapPlayers} duration={duration} totalDuration={this.props.duration} turnNumber={turn} />;
		}).toArray();

		let width = 100 - 100 / this.props.duration * this.props.at;

		return (
			<div className="joust-scrubber-timeline"
				ref={(ref) => this.ref = ref}
				style={{ cursor: 'pointer' }}
				onMouseDown={this.onMouseDown.bind(this) }
				onTouchStart={this.onTouchStart.bind(this) }
				>
				{mulligan}
				{turns}
				<div className="joust-scrubber-progress inverse" style={{ width: width + '%' }}></div>
			</div>
		);
	}

	public isInhibiting(): boolean {
		return this.state.isDragging;
	}
}

export default Timeline;
