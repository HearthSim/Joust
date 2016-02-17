import * as React from "react";
import {GameWidgetProps, JoustClient, CardDataProps, AssetDirectoryProps, CardOracle} from "../interfaces";
import Scrubber from "./Scrubber";
import GameState from "../state/GameState";
import GameWrapper from "./GameWrapper";
import {InteractiveBackend} from "../interfaces";
import GameStateScrubber from "../state/GameStateScrubber";
import GameStateSink from "../state/GameStateSink";
import Fullscreen from "fullscreen";

interface GameWidgetState {
	gameState?:GameState;
	swapPlayers?:boolean;
	isFullscreen?:boolean;
}

class GameWidget extends React.Component<GameWidgetProps, GameWidgetState> {
	private cb;
	private ref:HTMLDivElement;
	private fullscreen:Fullscreen;

	constructor(props:GameWidgetProps) {
		super(props);
		this.state = {
			gameState: null,
			swapPlayers: false,
			isFullscreen: false
		};
	}

	public componentDidMount() {
		this.cb = this.setGameState.bind(this);
		this.props.sink.on('gamestate', this.cb.bind(this));
		this.fullscreen = new Fullscreen(this.ref);
		this.fullscreen.on('attain', this.onAttainFullscreen.bind(this));
		this.fullscreen.on('release', this.onReleaseFullscreen.bind(this));
	}

	protected setGameState(gameState:GameState):void {
		this.setState({gameState: gameState});
	}

	protected componentWillUnmount() {
		this.props.sink.removeListener('gamestate', this.cb);
		console.log('unmount');
		this.fullscreen.removeAllListeners('attain');
		this.fullscreen.removeAllListeners('release');
	}

	protected onClickExit(e):void {
		e.preventDefault();
		if (this.props.exitGame) {
			this.props.exitGame();
		}
	}

	protected swapPlayers():void {
		this.setState({swapPlayers: !this.state.swapPlayers});
	}

	protected onClickFullscreen() {
		this.fullscreen.request();
	}

	protected onAttainFullscreen() {
		this.setState({isFullscreen: true});
	}

	protected onClickMinimize() {
		this.fullscreen.release();
	}

	protected onReleaseFullscreen() {
		this.setState({isFullscreen: false});
	}

	public render():JSX.Element {

		var parts = [];

		if (this.props.exitGame) {
			parts.push(<a key="exit" href="#" onClick={this.onClickExit.bind(this)}>Exit Game</a>);
		}

		parts.push(<GameWrapper key="game" state={this.state.gameState} interaction={this.props.interaction}
								assetDirectory={this.props.assetDirectory}
								cards={this.props.cards} swapPlayers={this.state.swapPlayers}
								cardOracle={this.props.cardOracle && this.props.cardOracle.getCardMap()}
		/>);

		if (this.props.scrubber) {
			parts.push(<Scrubber key="scrubber" scrubber={this.props.scrubber}
								 swapPlayers={this.swapPlayers.bind(this)}
								 isFullscreen={this.state.isFullscreen}
								 isFullscreenAvailable={Fullscreen.available()}
								 onClickFullscreen={this.onClickFullscreen.bind(this)}
								 onClickMinimize={this.onClickMinimize.bind(this)}
			/>);
		}

		var style = {};
		if(!this.state.isFullscreen) {
			if (this.props.width) {
				style['width'] = this.props.width;
			}
			if (this.props.height) {
				style['height'] = this.props.height;
			}
		}

		return (
			<div className="joust-widget game-widget" ref={(ref) => this.ref = ref} style={style}>
				{parts}
			</div>
		);
	}
}

export default GameWidget;