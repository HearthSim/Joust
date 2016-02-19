import * as React from "react";
import {StreamScrubber} from "../interfaces";
import Timeline from "./Timeline";
import SpeedSelector from "./SpeedSelector";

interface ScrubberProps extends React.Props<any> {
	scrubber:StreamScrubber;
	swapPlayers?:() => void;
	isFullscreen?:boolean;
	isFullscreenAvailable?:boolean;
	onClickFullscreen?:() => void;
	onClickMinimize?:() => void;
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
			speed: 1,
		};
		this.updateStateCb = this.updateState.bind(this);
		this.registerListeners(this.props);
	}

	private updateStateCb;

	public componentWillUpdate(nextProps:ScrubberProps, nextState:ScrubberState) {
		this.removeListeners(this.props);
		this.registerListeners(nextProps);
	}

	private registerListeners(props:ScrubberProps) {
		props.scrubber.on('update', this.updateStateCb);
	}

	private removeListeners(props:ScrubberProps) {
		props.scrubber.removeListener('update', this.updateStateCb);
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

	public componentWillUnmount() {
		this.removeListeners(this.props);
	}

	public render():JSX.Element {
		var playpause = this.state.playing ?
			<button onClick={this.pause.bind(this)} disabled={!this.state.canInteract} title="Pause">⏸</button> :
			<button onClick={this.play.bind(this)} disabled={!this.state.canPlay} title="Play">▶</button>;


		var fullscreen = this.props.isFullscreen ?
			<button onClick={this.props.onClickMinimize} title="Minimize">↙</button> :
			<button onClick={this.props.onClickFullscreen} disabled={!this.props.isFullscreenAvailable}
					title="Fullscreen">↗</button>;
		return (
			<div className="scrubber">
				{playpause}
				<button onClick={this.rewind.bind(this)} disabled={!this.state.canRewind} title="Rewind">⏮</button>
				<Timeline duration={this.props.scrubber.getDuration()}
						  at={this.props.scrubber.getCurrentTime()}
						  seek={this.props.scrubber.seek.bind(this.props.scrubber)}
				/>
				<SpeedSelector speed={this.state.speed}
							   speeds={[1, 2, 5, 10, 25]}
							   selectSpeed={this.selectSpeed.bind(this)}
							   disabled={!this.state.canInteract}
				/>
				<button onClick={this.props.swapPlayers} disabled={!this.state.canInteract} title="Swap players">⇅
				</button>
				{fullscreen}
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

	public selectSpeed(speed:number):void {
		var speed = Math.max(speed, 0);
		this.props.scrubber.setSpeed(speed);
	}
}

export default Scrubber;