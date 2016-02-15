import * as React from "react";
import {StreamScrubber} from "../interfaces";

interface ScrubberProps extends React.Props<any> {
	scrubber:StreamScrubber;
	swapPlayers?:() => void;
}

interface ScrubberState {
	playing?:boolean;
	canInteract?:boolean;
	canRewind?:boolean;
	canPlay?:boolean;
	speed?:number;
}

class Scrubber extends React.Component<ScrubberProps, ScrubberState> {

	constructor(props:ScrubberProps) {
		super(props);
		this.state = {
			playing: false,
			canInteract: false,
			canRewind: false,
			canPlay: false,
			speed: 1
		}
	}

	private cb;

	public componentDidMount() {
		this.cb = this.updateState.bind(this);
		this.props.scrubber.on('update', this.cb.bind(this));
	}

	protected updateState():void {
		var scrubber = this.props.scrubber;
		this.setState({
			playing: scrubber.isPlaying(),
			canInteract: scrubber.canInteract(),
			canPlay: scrubber.canPlay(),
			canRewind: scrubber.canRewind(),
			speed: scrubber.getSpeed()
		});
	}

	protected componentWillUnmount() {
		this.props.scrubber.removeListener('update', this.cb);
	}

	private pad(i:number, length:number) {
		return Array(length - (i + '').length + 1).join('0') + i;
	}

	public render():JSX.Element {
		var playpause = this.state.playing ?
			<button onClick={this.pause.bind(this)} disabled={!this.state.canInteract} title="Pause">⏸</button> :
			<button onClick={this.play.bind(this)} disabled={!this.state.canPlay} title="Play">▶</button>;

		var seconds = Math.round(this.props.scrubber.getCurrentTime() / 1000);
		var time = this.pad(Math.floor(seconds / 60), 2) + ':' + this.pad((seconds % 60), 2);
		var speedValues = [1, 2, 5, 10, 25];
		var speeds = speedValues.map(function (val) {
			return <option key={val} value={''+val}>{val}&times;</option>;
		}.bind(this));

		return (
			<div className="scrubber">
				{playpause}
				<button onClick={this.rewind.bind(this)} disabled={!this.state.canRewind} title="Rewind">⏮</button>
				<span className="scrubber-time">{time}</span>
				<div className="scrubber-history">
				</div>
				<select onChange={this.changeSpeed.bind(this)} value={''+this.state.speed}
						disabled={!this.state.canInteract} title="Playback speed">
					{speeds}
				</select>
				<button onClick={this.props.swapPlayers} disabled={!this.state.canInteract} title="Swap players">⇅
				</button>
			</div>
		);
	}

	public play():void {
		this.props.scrubber.play();
	}

	public pause():void {
		this.props.scrubber.pause();
	}

	public rewind():void {
		this.props.scrubber.rewind();
	}

	public changeSpeed(e):void {
		var speed = Math.max(+e.target.value, 0);
		this.props.scrubber.setSpeed(speed);
	}
}

export default Scrubber;