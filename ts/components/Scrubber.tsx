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
}

class Scrubber extends React.Component<ScrubberProps, ScrubberState> {

	constructor(props:ScrubberProps) {
		super(props);
		this.state = {
			playing: false,
			canInteract: false,
			canRewind: false,
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
			canRewind: scrubber.canRewind()
		});
	}

	protected componentWillUnmount() {
		this.props.scrubber.removeListener('update', this.cb);
	}

	public render():JSX.Element {
		var playpause = this.state.playing ?
			<button onClick={this.pause.bind(this)} disabled={!this.state.canInteract}>⏸</button> :
			<button onClick={this.play.bind(this)} disabled={!this.state.canInteract}>▶</button>;

		var seconds = Math.round(this.props.scrubber.getCurrentTime() / 1000);
		var time = Math.floor(seconds / 60) + ':' + (seconds % 60);

		return (
			<div className="scrubber">
				{playpause}
				<button onClick={this.rewind.bind(this)} disabled={!this.state.canRewind}>⏮</button>
				<span>{time}</span>
				<div className="scrubber-history">
				</div>
				<button onClick={this.props.swapPlayers} disabled={!this.state.canInteract}>⇅</button>
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
}

export default Scrubber;