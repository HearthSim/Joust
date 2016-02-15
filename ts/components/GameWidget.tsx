import * as React from "react";
import {JoustClient, CardDataProps} from "../interfaces";
import Scrubber from "./Scrubber";
import GameState from "../state/GameState";
import GameWrapper from "./GameWrapper";
import {InteractiveBackend} from "../interfaces";
import GameStateScrubber from "../state/GameStateScrubber";
import GameStateSink from "../state/GameStateSink";
import {CardOracle} from "../interfaces";

interface GameWidgetProps extends CardDataProps, React.Props<any> {
	sink:GameStateSink;
	interaction?:InteractiveBackend;
	scrubber?:GameStateScrubber;
	getImageURL?:(cardId:string) => string;
	exitGame?:() => void;
	cardOracle: CardOracle;
	width?:any;
	height?:any;
}

interface GameWidgetState {
	gameState?:GameState;
	swapPlayers?:boolean;
}

class GameWidget extends React.Component<GameWidgetProps, GameWidgetState> {
	private cb = null;

	constructor(props:GameWidgetProps) {
		super(props);
		this.state = {
			gameState: null,
			swapPlayers: false
		};
	}

	public componentDidMount() {
		this.cb = this.setGameState.bind(this);
		this.props.sink.on('gamestate', this.cb.bind(this));
	}

	protected setGameState(gameState:GameState):void {
		this.setState({gameState: gameState});
	}

	protected componentWillUnmount() {
		this.props.sink.removeListener('gamestate', this.cb);
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

	public render():JSX.Element {

		var parts = [];

		if (this.props.exitGame) {
			parts.push(<a key="exit" href="#" onClick={this.onClickExit.bind(this)}>Exit Game</a>);
		}

		parts.push(<GameWrapper key="game" state={this.state.gameState} interaction={this.props.interaction}
								cards={this.props.cards} swapPlayers={this.state.swapPlayers} cardOracle={this.props.cardOracle.getCardMap()}/>);

		if (this.props.scrubber) {
			parts.push(<Scrubber key="scrubber" scrubber={this.props.scrubber}
								 swapPlayers={this.swapPlayers.bind(this)}/>);
		}

		var style = {};
		if (this.props.width) {
			style['width'] = this.props.width;
		}
		if (this.props.height) {
			style['height'] = this.props.height;
		}

		return (
			<div className="joust-widget game-widget" style={style}>
				{parts}
			</div>
		);
	}
}

export default GameWidget;