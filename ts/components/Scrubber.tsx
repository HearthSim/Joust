import * as React from "react";
import {StreamScrubber} from "../interfaces";
import Fullscreen from "fullscreen";

interface ScrubberProps extends React.Props<any> {
	scrubber:StreamScrubber;
	swapPlayers?:() => void;
	fullscreen?:Fullscreen;
}

interface ScrubberState {
	playing?:boolean;
	canInteract?:boolean;
	canRewind?:boolean;
	canPlay?:boolean;
	speed?:number;
	isFullscreen?:boolean;
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
			isFullscreen: false
		};
		this.attainFullscreenCb = this.onAttainFullscreen.bind(this);
		this.releaseFullscreenCb = this.onReleaseFullscreen.bind(this);
		this.updateStateCb = this.updateState.bind(this);
		this.registerListeners(this.props);
	}

	private updateStateCb;
	private attainFullscreenCb;
	private releaseFullscreenCb;

	public componentWillUpdate(nextProps:ScrubberProps, nextState:ScrubberState) {
		this.removeListeners(this.props);
		this.registerListeners(nextProps);
	}

	private registerListeners(props:ScrubberProps) {
		if (props.fullscreen) {
			props.fullscreen.on('attain', this.attainFullscreenCb);
			props.fullscreen.on('release', this.releaseFullscreenCb);
		}
		props.scrubber.on('update', this.updateStateCb);
	}

	private removeListeners(props:ScrubberProps) {
		if (props.fullscreen) {
			props.fullscreen.removeListener('attain', this.attainFullscreenCb);
			props.fullscreen.removeListener('release', this.releaseFullscreenCb);
		}
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
		var fullscreen = this.state.isFullscreen ?
			<button onClick={this.onClickMinimize.bind(this)} title="Minimize">↙</button> :
			<button onClick={this.onClickFullscreen.bind(this)} title="Fullscreen">↗</button>;
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

	public changeSpeed(e):void {
		var speed = Math.max(+e.target.value, 0);
		this.props.scrubber.setSpeed(speed);
	}

	protected onClickFullscreen() {
		this.props.fullscreen.request();
	}

	protected onAttainFullscreen() {
		this.setState({isFullscreen: true});
	}

	protected onClickMinimize() {
		this.props.fullscreen.release();
	}

	protected onReleaseFullscreen() {
		this.setState({isFullscreen: false});
	}
}

export default Scrubber;