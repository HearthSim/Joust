import * as React from "react";
import GameStateHistory from "../state/GameStateHistory";
import GameStateScrubber from "../state/GameStateScrubber";
import {StreamScrubberInhibitor} from "../interfaces";
import GameState from "../state/GameState";
import Turn from "./Turn";

interface TimelineProps extends React.Props<any> {
	at: number;
	duration: number;
	seek:(time:number) => void;
	turnMap?: Immutable.Map<number, GameState>;
}

interface TimelineState {
	isDragging?: boolean;
}

class Timeline extends React.Component<TimelineProps, TimelineState> implements StreamScrubberInhibitor {
	private ref:HTMLDivElement;
	private mouseMove:(e) => void;
	private mouseUp:(e) => void;

	constructor(props:TimelineProps) {
		super(props);
		this.state = {
			isDragging: false
		};
		this.mouseMove = this.onMouseMove.bind(this);
		this.mouseUp = this.onMouseUp.bind(this);
	}

	public componentDidMount():void {
		document.addEventListener('mousemove', this.mouseMove);
		document.addEventListener('mouseup', this.mouseUp);
	}

	public componentWillUnmount():void {
		document.removeEventListener('mousemove', this.mouseMove);
		document.removeEventListener('mouseup', this.mouseUp);
	}

	protected onMouseDown(e):void {
		if (e.button !== 0) {
			// any button other than left click
			return;
		}
		e.preventDefault();
		this.setState({isDragging: true});
		this.seek(e);
	}

	protected onMouseMove(e):void {
		if (!this.state.isDragging) {
			return;
		}

		this.seek(e);
	}

	protected seek(e):void {
		var rect = this.ref.getBoundingClientRect();
		var offset = Math.min(Math.max(rect.left, e.clientX), rect.right);

		var width = rect.right - rect.left;
		offset = offset - rect.left;

		var seek = this.props.duration / width * offset;
		this.props.seek(seek);
	}

	protected onMouseUp(e):void {
		this.setState({isDragging: false});
	}

	public render():JSX.Element {
		let mulligan = this.props.turnMap.has(1) ?
			<Turn key={0}
				  mulligan={true}
				  duration={this.props.turnMap.get(1).getTime()}
				  totalDuration={this.props.duration}
			/> : null;

		let turns = this.props.turnMap.map((current:GameState, turn:number, map:Immutable.Map<number, GameState>):JSX.Element => {
			let duration = 0;
			if (map.has(turn + 1)) {
				let next = map.get(turn + 1);
				duration = next.getTime() - current.getTime();
			}
			else {
				duration = this.props.duration - current.getTime();
			}

			return <Turn key={turn} state={current} duration={duration} totalDuration={this.props.duration}/>;
		});

		let width = 100 - 100 / this.props.duration * this.props.at;

		return (
			<div className="joust-scrubber-timeline"
				 ref={(ref) => this.ref = ref}
				 style={{cursor: 'pointer'}}
				 onMouseDown={this.onMouseDown.bind(this)}
			>
				{mulligan}
				{turns}
				<div className="joust-scrubber-progress inverse" style={{width: width + '%'}}></div>
			</div>
		);
	}

	public isInhibiting():boolean {
		return this.state.isDragging;
	}
}

export default Timeline;
