import * as React from "react";
import {GameWidgetProps, JoustClient, CardDataProps, AssetDirectoryProps, CardOracle, RevealedCardData} from "../interfaces";
import Scrubber from "./Scrubber";
import GameState from "../state/GameState";
import GameWrapper from "./GameWrapper";
import {InteractiveBackend} from "../interfaces";
import GameStateScrubber from "../state/GameStateScrubber";
import GameStateSink from "../state/GameStateSink";
import Fullscreen from "fullscreen";
import {CardData} from "../interfaces";
import * as Immutable from "immutable";

interface GameWidgetState {
	gameState?:GameState;
	swapPlayers?:boolean;
	isFullscreen?:boolean;
	isFullscreenAvailable?:boolean;
	cardOracle?:Immutable.Map<number, RevealedCardData>;
	cards?:Immutable.Map<string, CardData>;
	isRevealingCards?:boolean;
}

class GameWidget extends React.Component<GameWidgetProps, GameWidgetState> {
	private cb;
	private cardOracleCb;
	private ref:HTMLDivElement;
	private fullscreen:Fullscreen;

	constructor(props:GameWidgetProps) {
		super(props);
		this.state = {
			gameState: null,
			swapPlayers: false,
			isFullscreen: false,
			isFullscreenAvailable: Fullscreen.available(),
			isRevealingCards: true,
			cardOracle: null
		};
	}

	public componentDidMount() {
		this.cb = this.setGameState.bind(this);
		this.props.sink.on('gamestate', this.cb.bind(this));
		this.fullscreen = new Fullscreen(this.ref);
		this.fullscreen.on('attain', this.onAttainFullscreen.bind(this));
		this.fullscreen.on('release', this.onReleaseFullscreen.bind(this));
		this.cardOracleCb = this.updateCardOracle.bind(this);
		if (this.props.cardOracle) {
			this.props.cardOracle.on('cards', this.cardOracleCb);
		}
	}

	protected setGameState(gameState:GameState):void {
		this.setState({gameState: gameState});
	}

	protected componentWillUnmount() {
		this.props.sink.removeListener('gamestate', this.cb);
		this.fullscreen.removeAllListeners('attain');
		this.fullscreen.removeAllListeners('release');
		this.props.cardOracle.removeListener('cards', this.cardOracleCb);
	}

	protected onClickExit(e):void {
		e.preventDefault();
		if (this.props.exitGame) {
			this.props.exitGame();
		}
	}

	protected onAttainFullscreen() {
		this.setState({isFullscreen: true});
		this.triggerResize();
	}

	protected onReleaseFullscreen() {
		this.setState({isFullscreen: false});
		this.triggerResize();
	}

	protected updateCardOracle(cards:Immutable.Map<number, RevealedCardData>) {
		this.setState({cardOracle: cards});
	}

	public setCards(cards:CardData[]) {
		var cardMap = null;
		if (cards) {
			if (!cards.length) {
				console.error('Got invalid card data to metadata callback (expected card data array)');
				return;
			}
			cardMap = Immutable.Map<string, CardData>();

			cardMap = cardMap.withMutations(function (map) {
				cards.forEach(function (card:CardData) {
					map = map.set(card.id, card);
				});
			});
		}
		this.setState({cards: cardMap});
	}

	/**
	 * Trigger a window.resize event.
	 * This fixes react-dimensions not picking up fullscreen/minimize events.
	 */
	protected triggerResize() {
		try {
			var event = document.createEvent('UIEvents');
			event.initUIEvent('resize', true, false, window, 0);
			window.dispatchEvent(event);
		} catch (e) {
		}
	}

	public render():JSX.Element {

		var parts = [];

		if (this.props.exitGame) {
			parts.push(<a key="exit" href="#" onClick={this.onClickExit.bind(this)}>Exit Game</a>);
		}

		parts.push(<GameWrapper key="game" state={this.state.gameState} interaction={this.props.interaction}
								assetDirectory={this.props.assetDirectory} textureDirectory={this.props.textureDirectory}
								cards={this.state.cards} swapPlayers={this.state.swapPlayers}
								cardOracle={this.state.isRevealingCards && this.state.cardOracle}
		/>);

		if (this.props.scrubber) {
			parts.push(<Scrubber key="scrubber" scrubber={this.props.scrubber}
								 swapPlayers={() => this.setState({swapPlayers: !this.state.swapPlayers})}
								 isFullscreen={this.state.isFullscreen}
								 isFullscreenAvailable={this.state.isFullscreenAvailable}
								 onClickFullscreen={() => this.fullscreen.request()}
								 onClickMinimize={() => this.fullscreen.release()}
								 isRevealingCards={this.state.isRevealingCards}
								 canRevealCards={!!this.state.cardOracle}
								 onClickHideCards={() => this.setState({isRevealingCards: false})}
								 onClickRevealCards={() => this.setState({isRevealingCards: true})}
			/>);
		}

		var style = {};
		if (!this.state.isFullscreen) {
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

	public shouldComponentUpdate(nextProps:GameWidgetProps, nextState:GameWidgetState) {
		if (this.state.cardOracle !== nextState.cardOracle) {
			if (this.props.scrubber && this.props.scrubber.isPlaying()) {
				return false;
			}
		}
		return true;
	}
}

export default GameWidget;