import * as React from "react";
import {StreamScrubber} from "../interfaces";
import Timeline from "./Timeline";
import SpeedSelector from "./SpeedSelector";

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

	private registerListeners(props: ScrubberProps): void {
		props.scrubber.on('update', this.updateState);
		document.addEventListener('keydown', this.onKeyDown);
	}

	private removeListeners(props: ScrubberProps): void {
		props.scrubber.removeListener('update', this.updateState);
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

	protected updateState = (): void => {
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
			<button onClick={this.pause.bind(this) } disabled={!this.state.canInteract} title="Pause">
				<i className="joust-fa joust-fa-pause"></i>
			</button> :
			<button onClick={this.play.bind(this) } disabled={!this.state.canPlay} title="Play">
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

		var rewind = <button onClick={this.rewind.bind(this) } disabled={!this.state.canRewind} title="Rewind">
			<i className="joust-fa joust-fa-fast-backward"></i>
		</button>;

		var swap = <button onClick={this.props.swapPlayers} disabled={!this.state.canInteract} title="Swap players">
			<i className="joust-fa joust-fa-unsorted"></i>
		</button>;

		var log = <button onClick={this.props.toggleLog} disabled={!this.state.canInteract} title={this.props.isLogVisible ? "Hide log" : "Show log"}>
			<i className="joust-fa joust-fa-bars"></i>
		</button>;

		return (
			<div className="joust-scrubber">
				{playpause}
				<SpeedSelector speed={this.state.speed}
							   speeds={Scrubber.SPEEDS}
							   selectSpeed={this.selectSpeed}
							   disabled={!this.state.canInteract}
				/>
				<Timeline duration={this.props.scrubber.getDuration() }
					at={this.props.scrubber.getCurrentTime() }
					seek={this.props.scrubber.seek.bind(this.props.scrubber) }
					turnMap={this.props.scrubber.getHistory().turnMap}
					swapPlayers={this.props.isSwapped}
					disabled={!this.state.canInteract}
					ref={(inhibitor) => this.props.scrubber.setInhibitor(inhibitor) }
					/>
				{reveal}
				{log}
				{swap}
				{fullscreen}
			</div>
		);
	}

	protected play = (): void => {
		this.props.scrubber.play();
	}

	protected pause = (): void => {
		this.props.scrubber.pause();
	}

	protected rewind = (): void => {
		let play = false;
		if (this.props.scrubber.hasEnded()) {
			play = true;
		}
		this.props.scrubber.rewind();
		if (play) {
			this.props.scrubber.play();
		}
	}

	protected selectSpeed = (speed: number): void => {
		var speed = Math.max(speed, 0);
		this.props.scrubber.setSpeed(speed);
	}
}

export default Scrubber;
