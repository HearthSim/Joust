import * as React from "react";
import {StreamScrubber} from "../interfaces";
import Timeline from "./Timeline";
import SpeedSelector from "./SpeedSelector";
import Tooltipper from "./Tooltipper";

interface ScrubberProps extends React.Props<any> {
	scrubber: StreamScrubber;
	swapPlayers?: () => void;
	isSwapped?: boolean;
	isFullscreen?: boolean;
	isFullscreenAvailable?: boolean;
	onClickFullscreen?: () => void;
	onClickMinimize?: () => void;
	isRevealingCards?: boolean;
	canRevealCards?: boolean;
	onClickHideCards?: () => void;
	onClickRevealCards?: () => void;
	isLogVisible?: boolean;
	toggleLog?: () => void;
}

interface ScrubberState {
	playing?: boolean;
	canInteract?: boolean;
	canRewind?: boolean;
	canPlay?: boolean;
	speed?: number;
}

class Scrubber extends React.Component<ScrubberProps, ScrubberState> {

	private static SPEEDS = [1, 1.5, 2, 3, 4, 8];

	constructor(props: ScrubberProps) {
		super(props);
		this.state = {
			playing: false,
			canInteract: false,
			canRewind: false,
			canPlay: false,
			speed: 1,
		};
		this.onKeyDown = this.onKeyDown.bind(this);
		this.registerListeners(this.props);
	}

	public componentWillUpdate(nextProps: ScrubberProps, nextState: ScrubberState): void {
		this.removeListeners(this.props);
		this.registerListeners(nextProps);
	}

	private updateListener = () => this.updateState();

	private registerListeners(props: ScrubberProps): void {
		props.scrubber.on('update', this.updateListener);
		document.addEventListener('keydown', this.onKeyDown);
	}

	private removeListeners(props: ScrubberProps): void {
		props.scrubber.removeListener('update', this.updateListener);
		document.removeEventListener('keydown', this.onKeyDown);
	}

	private onKeyDown(e: KeyboardEvent): void {
		if (!this.state.canInteract) {
			return;
		}
		if(e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
			// do not trigger with modifier
			return;
		}
		switch (e.keyCode) {
			case 32: // spacebar
			case 75: // k
				e.preventDefault();
				this.props.scrubber.toggle();
				break;
			case 37: // left arrow
			case 74: // j
				e.preventDefault();
				this.props.scrubber.skipBack();
				break;
			case 39: // right arrow
			case 76: // l
				e.preventDefault();
				this.props.scrubber.nextTurn();
				break;
			case 36: // home
				e.preventDefault();
				this.props.scrubber.rewind();
				break;
			case 35: // end
				e.preventDefault();
				this.props.scrubber.fastForward();
				break;
			case 88: // x
				e.preventDefault();
				if (!this.props.canRevealCards) {
					return;
				}
				if (this.props.isRevealingCards) {
					this.props.onClickHideCards && this.props.onClickHideCards();
				}
				else {
					this.props.onClickRevealCards && this.props.onClickRevealCards();
				}
				break;
			case 87: // w
				e.preventDefault();
				{
					let index = Scrubber.SPEEDS.indexOf(this.state.speed) + 1;
					if (Scrubber.SPEEDS[index]) {
						this.selectSpeed(Scrubber.SPEEDS[index]);
					}
				}
				break;
			case 83: // s
				e.preventDefault();
				{
					let index = Scrubber.SPEEDS.indexOf(this.state.speed) - 1;
					if (Scrubber.SPEEDS[index]) {
						this.selectSpeed(Scrubber.SPEEDS[index]);
					}
				}
				break;
			case 67: // c
				e.preventDefault();
				this.props.swapPlayers();
				break;
		}
	}

	protected updateState(): void {
		var scrubber = this.props.scrubber;
		this.setState({
			playing: scrubber.isPlaying(),
			canInteract: scrubber.canInteract(),
			canPlay: scrubber.canPlay(),
			canRewind: scrubber.canRewind(),
			speed: scrubber.getSpeed()
		});
	}

	public componentWillUnmount(): void {
		this.removeListeners(this.props);
	}

	public render(): JSX.Element {
		var playpause = this.state.playing ?
			<Tooltipper title="Pause" align="left">
				<button onClick={() => this.pause()} disabled={!this.state.canInteract} className="joust-scrubber-button-wide"><i className="joust-fa joust-fa-pause"></i></button>
			</Tooltipper> :
			<Tooltipper title="Play" align="left">
				<button onClick={() => this.play()} disabled={!this.state.canPlay} className="joust-scrubber-button-wide"><i className="joust-fa joust-fa-play"></i></button>
			</Tooltipper>;

		var restart = <Tooltipper title="Restart" align="left">
			<button onClick={() => this.rewind()} disabled={!this.state.canRewind} className="joust-scrubber-button-wide"><i className="joust-fa joust-fa-fast-backward"></i></button>
		</Tooltipper>;

		var fullscreen = this.props.isFullscreen ?
			<Tooltipper title="Minimize" align="right">
				<button onClick={this.props.onClickMinimize}><i className="joust-fa joust-fa-compress"></i></button>
			</Tooltipper> :
			<Tooltipper title="Fullscreen" align="right">
				<button onClick={this.props.onClickFullscreen} disabled={!this.props.isFullscreenAvailable}><i className="joust-fa joust-fa-expand"></i></button>
			</Tooltipper>;

		var reveal = this.props.isRevealingCards ?
			<Tooltipper title="Hide cards">
				<button onClick={this.props.onClickHideCards}><i className="joust-fa joust-fa-eye-slash"></i></button>
			</Tooltipper> :
			<Tooltipper title="Reveal cards">
				<button onClick={this.props.onClickRevealCards} disabled={!this.props.canRevealCards}><i className="joust-fa joust-fa-eye"></i></button>
			</Tooltipper>;

		var swap = <Tooltipper title="Swap players">
			<button onClick={this.props.swapPlayers} disabled={!this.state.canInteract}><i className="joust-fa joust-fa-unsorted"></i></button>
		</Tooltipper>;

		var log = <Tooltipper title={this.props.isLogVisible ? "Hide event log" : "Show event log"}>
			<button onClick={this.props.toggleLog} disabled={!this.state.canInteract}><i className="joust-fa joust-fa-bars"></i></button>
		</Tooltipper>;

		return (
			<div className="joust-scrubber">
				{this.state.canRewind && !this.state.canPlay ? restart : playpause}
				<Tooltipper title="Playback speed"><SpeedSelector speed={this.state.speed}
							   speeds={Scrubber.SPEEDS}
							   selectSpeed={(speed: number) => this.selectSpeed(speed)}
							   disabled={!this.state.canInteract}
				/></Tooltipper>
				<Timeline duration={this.props.scrubber.getDuration() }
					at={this.props.scrubber.getCurrentTime() }
					seek={this.props.scrubber.seek.bind(this.props.scrubber) }
					turnMap={this.props.scrubber.getHistory().turnMap}
					swapPlayers={this.props.isSwapped}
					disabled={!this.state.canInteract}
					ref={(inhibitor) => this.props.scrubber.setInhibitor(inhibitor) }
					/>
				{reveal}
				{swap}
				{log}
				{fullscreen}
			</div>
		);
	}

	protected play (): void {
		this.props.scrubber.play();
	}

	protected pause(): void {
		this.props.scrubber.pause();
	}

	protected rewind(): void {
		let play = false;
		if (this.props.scrubber.hasEnded()) {
			play = true;
		}
		this.props.scrubber.rewind();
		if (play) {
			this.props.scrubber.play();
		}
	}

	protected selectSpeed(speed: number): void {
		var speed = Math.max(speed, 0);
		this.props.scrubber.setSpeed(speed);
	}
}

export default Scrubber;
