import * as React from "react";
import {CardDataProps, HideCardsProps} from "../interfaces";
import GameState from "../state/GameState";
import TwoPlayerGame from "./game/TwoPlayerGame";
import {CardType, OptionType} from "../enums";
import Entity from "../Entity";
import Option from "../Option";
import PlayerEntity from "../Player";
import {InteractiveBackend, CardOracleProps, AssetDirectoryProps, CardArtDirectory} from "../interfaces";
import {Zone} from "../enums";
import LoadingScreen from "./LoadingScreen";

interface GameWrapperProps extends CardDataProps, CardOracleProps, AssetDirectoryProps, CardArtDirectory, HideCardsProps, React.Props<any> {
	state: GameState;
	interaction?: InteractiveBackend;
	swapPlayers?: boolean;
	hasStarted?: boolean;
}

/**
 * This component wraps around the /actual/ game component (such as TwoPlayerGame).
 * It extracts the game entities.
 */
class GameWrapper extends React.Component<GameWrapperProps, {}> {

	public render(): JSX.Element {

		// check if we even have a game state
		var gameState = this.props.state;
		if (!gameState) {
			return this.renderLoadingScreen();
		}

		var entityTree = gameState.entityTree;
		var optionTree = gameState.optionTree;

		// check if any entities are present
		var allEntities = gameState.entities;
		if (!allEntities) {
			return this.renderLoadingScreen();
		}

		// find the game entity
		var game = allEntities.filter(GameWrapper.filterByCardType(CardType.GAME)).first();
		if (!game) {
			return this.renderLoadingScreen();
		}

		// find the players
		var players = allEntities.filter(GameWrapper.filterByCardType(CardType.PLAYER)) as Immutable.Map<number, PlayerEntity>;
		if (players.count() == 0) {
			return this.renderLoadingScreen();
		}

		// wait for start
		if(typeof this.props.hasStarted !== "undefined" && !this.props.hasStarted) {
			return this.renderLoadingScreen(players.map((player: PlayerEntity) => {
				return player.name;
			}).toArray());
		}

		// find an end turn option
		var endTurnOption = gameState.options.filter(function(option: Option): boolean {
			return !!option && option.type === OptionType.END_TURN;
		}).first();

		var playerCount = players.count();
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
					descriptors={this.props.state.descriptors}
					assetDirectory={this.props.assetDirectory}
					cardArtDirectory={this.props.cardArtDirectory}
					hideCards={this.props.hideCards}
					/>;
			default:
				return <div>Unsupported player count ({playerCount}).</div>
		}
	}

	private renderLoadingScreen(players?: string[]) {
		return <LoadingScreen players={players} />;
	}

	public static filterByCardType(cardType: CardType): (entity: Entity) => boolean {
		return function(entity: Entity): boolean {
			return !!entity && entity.getCardType() === cardType;
		};
	};
}

export default GameWrapper;
