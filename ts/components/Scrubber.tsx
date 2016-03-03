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
	isRevealingCards?:boolean;
	canRevealCards?:boolean;
	onClickHideCards?:() => void;
	onClickRevealCards?:() => void;
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
		this.registerListeners(this.props);
	}

	public componentWillUpdate(nextProps:ScrubberProps, nextState:ScrubberState):void {
		this.removeListeners(this.props);
		this.registerListeners(nextProps);
	}

	private registerListeners(props:ScrubberProps):void {
		props.scrubber.on('update', this.updateState);
	}

	private removeListeners(props:ScrubberProps):void {
		props.scrubber.removeListener('update', this.updateState);
	}

	protected updateState = ():void => {
		var scrubber = this.props.scrubber;
		this.setState({
			playing: scrubber.isPlaying(),
			canInteract: scrubber.canInteract(),
			canPlay: scrubber.canPlay(),
			canRewind: scrubber.canRewind(),
			speed: scrubber.getSpeed()
		});
	}

	public componentWillUnmount():void {
		this.removeListeners(this.props);
	}

	public render():JSX.Element {
		var playpause = this.state.playing ?
			<button onClick={this.pause.bind(this)} disabled={!this.state.canInteract} title="Pause">
				<i className="joust-fa joust-fa-pause"></i>
			</button> :
			<button onClick={this.play.bind(this)} disabled={!this.state.canPlay} title="Play">
				<i className="joust-fa joust-fa-play"></i>
			</button>;


		var fullscreen = this.props.isFullscreen ?
			<button onClick={this.props.onClickMinimize} title="Minimize">
				<i className="joust-fa joust-fa-compress"></i>
			</button> :
			<button onClick={this.props.onClickFullscreen} disabled={!this.props.isFullscreenAvailable}
					title="Fullscreen">
				<i className="joust-fa joust-fa-expand"></i>
			</button>;

		var reveal = this.props.isRevealingCards ?
			<button onClick={this.props.onClickHideCards} title="Hide cards">
				<i className="joust-fa joust-fa-eye-slash"></i>
			</button> :
			<button onClick={this.props.onClickRevealCards} title="Reveal cards" disabled={!this.props.canRevealCards}>
				<i className="joust-fa joust-fa-eye"></i>
			</button>;

		return (
			<div className="joust-scrubber">
				{playpause}
				<button onClick={this.rewind.bind(this)} disabled={!this.state.canRewind} title="Rewind">
					<i className="joust-fa joust-fa-fast-backward"></i>
				</button>
				<Timeline duration={this.props.scrubber.getDuration()}
						  at={this.props.scrubber.getCurrentTime()}
						  seek={this.props.scrubber.seek.bind(this.props.scrubber)}
						  turnMap={this.props.scrubber.getHistory().turnMap}
						  ref={(inhibitor) => this.props.scrubber.setInhibitor(inhibitor)}
				/>
				<SpeedSelector speed={this.state.speed}
							   speeds={[1, 2, 5, 10, 25]}
							   selectSpeed={this.selectSpeed}
							   disabled={!this.state.canInteract}
				/>
				{reveal}
				<button onClick={this.props.swapPlayers} disabled={!this.state.canInteract} title="Swap players">
					<i className="joust-fa joust-fa-unsorted"></i>
				</button>
				{fullscreen}
			</div>
		);
	}

	protected play = ():void => {
		this.props.scrubber.play();
	}

	protected pause = ():void => {
		this.props.scrubber.pause();
	}

	protected rewind = ():void => {
		this.props.scrubber.rewind();
	}

	protected selectSpeed = (speed:number):void => {
		var speed = Math.max(speed, 0);
		this.props.scrubber.setSpeed(speed);
	}
}

export default Scrubber;