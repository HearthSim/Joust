import * as React from "react";
import {
	CardDataProps,
	HideCardsProps,
	InteractiveBackend,
	CardOracleProps,
	AssetDirectoryProps,
	CardArtDirectory,
	MulliganOracleProps
} from "../interfaces";
import GameState from "../state/GameState";
import TwoPlayerGame from "./game/TwoPlayerGame";
import {CardType, OptionType} from "../enums";
import Entity from "../Entity";
import Option from "../Option";
import PlayerEntity from "../Player";
import LoadingScreen from "./LoadingScreen";
import * as bowser from "bowser";
import * as cookie from "cookiejs";

interface GameWrapperProps extends CardDataProps, CardOracleProps, MulliganOracleProps, AssetDirectoryProps, CardArtDirectory, HideCardsProps, React.ClassAttributes<GameWrapper> {
	state:GameState;
	interaction?:InteractiveBackend;
	swapPlayers?:boolean;
	hasStarted?:boolean;
}

interface GameWrapperState {
	warnAboutBrowser?:boolean;
}

/**
 * This component wraps around the /actual/ game component (such as TwoPlayerGame).
 * It extracts the game entities.
 */
export default class GameWrapper extends React.Component<GameWrapperProps, GameWrapperState> {

	constructor(props:GameWrapperProps, context:any) {
		super(props, context);
		let shouldWarn = false;
		let ignoreWarning = !!(+cookie.get("joust_ludicrous", "0"));
		if(!ignoreWarning) {
			shouldWarn = !(bowser.webkit || (bowser as any).blink || bowser.gecko)
		}
		this.state = {
			warnAboutBrowser: shouldWarn,
		};
	}

	public render():JSX.Element {

		// warn about unsupported browsers
		if (this.state.warnAboutBrowser) {
			let ignoreBrowser = (e) => {
				e.preventDefault();
				this.setState({warnAboutBrowser: false});
				cookie.set("joust_ludicrous", "1", {
					exires: 365, // one year
					path: "/",
				});
			};
			return (
				<LoadingScreen>
					<p>
						<small>Sorry, your browser is out of standard right now.<br/>Please consider using Chrome or Firefox instead.</small>
					</p>
					<p>
						<a href="#" onClick={ignoreBrowser} onTouchStart={ignoreBrowser}>Continue anyway</a>
					</p>
				</LoadingScreen>
			);
		}

		// check if we even have a game state
		let gameState = this.props.state;
		if (!gameState) {
			return this.renderLoadingScreen();
		}

		let entityTree = gameState.entityTree;
		let optionTree = gameState.optionTree;

		// check if any entities are present
		let allEntities = gameState.entities;
		if (!allEntities) {
			return this.renderLoadingScreen();
		}

		// find the game entity
		let game = allEntities.filter(GameWrapper.filterByCardType(CardType.GAME)).first();
		if (!game) {
			return this.renderLoadingScreen();
		}

		// find the players
		let players = allEntities.filter(GameWrapper.filterByCardType(CardType.PLAYER)) as Immutable.Map<number, PlayerEntity>;
		if (players.count() == 0) {
			return this.renderLoadingScreen();
		}

		// wait for start
		if (typeof this.props.hasStarted !== "undefined" && !this.props.hasStarted) {
			return this.renderLoadingScreen(players.map((player:PlayerEntity) => {
				return player.name;
			}).toArray());
		}

		// find an end turn option
		let endTurnOption = gameState.options.filter(function (option:Option):boolean {
			return !!option && option.type === OptionType.END_TURN;
		}).first();

		let playerCount = players.count();
		switch (playerCount) {
			case 2:
				let player1 = players.first();
				let player2 = players.last();
				if (this.props.swapPlayers) {
					[player1, player2] = [player2, player1];
				}
				return <TwoPlayerGame
					entity={game}
					player1={player1}
					player2={player2}
					entities={entityTree}
					options={optionTree}
					choices={gameState.choices}
					endTurnOption={endTurnOption}
					optionCallback={this.props.interaction && this.props.interaction.sendOption.bind(this.props.interaction) }
					cards={this.props.cards}
					cardOracle={this.props.cardOracle}
					mulliganOracle={this.props.mulliganOracle}
					descriptors={this.props.state.descriptors}
					assetDirectory={this.props.assetDirectory}
					cardArtDirectory={this.props.cardArtDirectory}
					hideCards={this.props.hideCards}
				/>;
			default:
				return <div>Unsupported player count ({playerCount}).</div>
		}
	}

	private renderLoadingScreen(players?:string[]) {
		return <LoadingScreen players={players}/>;
	}

	public static filterByCardType(cardType:CardType):(entity:Entity) => boolean {
		return function (entity:Entity):boolean {
			return !!entity && entity.getCardType() === cardType;
		};
	};
}
