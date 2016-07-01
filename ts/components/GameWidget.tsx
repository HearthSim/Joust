import * as React from "react";
import {GameWidgetProps, JoustClient, CardDataProps, AssetDirectoryProps, CardOracle} from "../interfaces";
import Scrubber from "./Scrubber";
import Log from "./Log";
import GameState from "../state/GameState";
import GameWrapper from "./GameWrapper";
import {InteractiveBackend} from "../interfaces";
import GameStateScrubber from "../state/GameStateScrubber";
import GameStateSink from "../state/GameStateSink";
import Fullscreen from "fullscreen";
import {CardData} from "../interfaces";
import * as Immutable from "immutable";
import {Zone} from "../enums";
import Entity from "../Entity";

interface GameWidgetState {
	gameState?: GameState;
	swapPlayers?: boolean;
	isFullscreen?: boolean;
	isFullscreenAvailable?: boolean;
	cardOracle?: Immutable.Map<number, string>;
	cards?: Immutable.Map<string, CardData>;
	isRevealingCards?: boolean;
}

class GameWidget extends React.Component<GameWidgetProps, GameWidgetState> {
	private cb;
	private cardOracleCb;
	private ref: HTMLDivElement;
	private fullscreen: Fullscreen;
	private hasCheckedForSwap = false;
	private swapPlayers = false;

	constructor(props: GameWidgetProps) {
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
		this.props.sink.once('gamestate', () => {
			this.track('startup', {count: 1, duration: (Date.now() - this.props.startupTime) / 1000});
		});
		this.fullscreen = new Fullscreen(this.ref);
		this.fullscreen.on('attain', this.onAttainFullscreen.bind(this));
		this.fullscreen.on('release', this.onReleaseFullscreen.bind(this));
		this.cardOracleCb = this.updateCardOracle.bind(this);
		if (this.props.cardOracle) {
			this.props.cardOracle.on('cards', this.cardOracleCb);
		}
	}

	private track(event: string, values: Object, tags?: Object): void {
		if(!this.props.events) {
			return;
		}
		this.props.events(event, values, tags || {});
	}

	protected setGameState(gameState: GameState): void {
		this.setState({ gameState: gameState });
	}

	protected componentWillUnmount() {
		this.props.sink.removeListener('gamestate', this.cb);
		this.fullscreen.removeAllListeners('attain');
		this.fullscreen.removeAllListeners('release');
		this.props.cardOracle.removeListener('cards', this.cardOracleCb);
	}

	protected onClickExit(e): void {
		e.preventDefault();
		if (this.props.exitGame) {
			this.props.exitGame();
		}
	}

	protected onAttainFullscreen() {
		this.setState({ isFullscreen: true });
		this.triggerResize();
	}

	protected onReleaseFullscreen() {
		this.setState({ isFullscreen: false });
		this.triggerResize();
	}

	protected updateCardOracle(cards: Immutable.Map<number, string>) {
		this.setState({ cardOracle: cards });
	}

	public setCards(cards: CardData[]) {
		var cardMap = null;
		if (cards) {
			if (!cards.length) {
				console.error('Got invalid card data to metadata callback (expected card data array)');
				return;
			}
			cardMap = Immutable.Map<string, CardData>();

			cardMap = cardMap.withMutations(function(map) {
				cards.forEach(function(card: CardData) {
					map = map.set(card.id, card);
				});
			});
		}
		this.setState({ cards: cardMap });
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

	private checkForSwap() {
		if(!this.state.gameState) {
			return;
		}
		let players = this.state.gameState.getPlayers();
		if(!players.length) {
			return;
		}
		let player = players[0];
		let cards = _.toArray(this.state.gameState.getEntityTree().get(player.getPlayerId()).get(Zone.HAND).toJS()) as Entity[];
		if (cards.length > 0) {
			this.hasCheckedForSwap = true;
			if (cards[0].isRevealed()) {
				this.swapPlayers = true;
			}
		}
	}

	public render(): JSX.Element {

		if (!this.hasCheckedForSwap) {
			this.checkForSwap();
		}

		var parts = [];

		if (this.props.exitGame) {
			parts.push(<div id="joust-quit" key="exit"><a href="#" onClick={this.onClickExit.bind(this) }>Exit Game</a></div>);
		}

		let isSwapped = this.swapPlayers !== this.state.swapPlayers /* XOR */;

		parts.push(<GameWrapper key="game" state={this.state.gameState} interaction={this.props.interaction}
			assetDirectory={this.props.assetDirectory} cardArtDirectory={this.props.cardArtDirectory}
			cards={this.state.cards} swapPlayers={isSwapped}
			cardOracle={this.state.cardOracle}
			hideCards={!this.state.isRevealingCards}
			/>);

		parts.push(<Log key="log"
			state={this.state.gameState}
			cards={this.state.cards}
			cardOracle={this.state.cardOracle}
			tail={this.props.scrubber.getHistory().tail}
			currentTime={this.props.scrubber.getCurrentTime()}
		/>);

		if (this.props.scrubber) {
			parts.push(<Scrubber key="scrubber" scrubber={this.props.scrubber}
				swapPlayers={() => this.setState({ swapPlayers: !this.state.swapPlayers }) }
				isSwapped={isSwapped}
				isFullscreen={this.state.isFullscreen}
				isFullscreenAvailable={this.state.isFullscreenAvailable}
				onClickFullscreen={() => this.fullscreen.request() }
				onClickMinimize={() => this.fullscreen.release() }
				isRevealingCards={this.state.isRevealingCards}
				canRevealCards={!!this.state.cardOracle}
				onClickHideCards={() => this.setState({ isRevealingCards: false }) }
				onClickRevealCards={() => this.setState({ isRevealingCards: true }) }
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

		var classes = ['joust-widget', 'game-widget'];
		if(this.state.isFullscreen) {
			classes.push('joust-fullscreen');
		}

		return (
			<div className={classes.join(' ')} ref={(ref) => this.ref = ref} style={style}>
				{parts}
			</div>
		);
	}

	public shouldComponentUpdate(nextProps: GameWidgetProps, nextState: GameWidgetState) {
		if (this.state.cardOracle !== nextState.cardOracle) {
			if (this.props.scrubber && this.props.scrubber.isPlaying()) {
				return false;
			}
		}
		return true;
	}
}

export default GameWidget;
