import * as React from "react";
import {CardDataProps} from "../interfaces";
import GameState from "../state/GameState";
import TwoPlayerGame from "./game/TwoPlayerGame";
import {CardType, OptionType} from "../enums";
import Entity from "../Entity";
import Option from "../Option";
import PlayerEntity from "../Player";
import {InteractiveBackend, CardOracleProps, AssetDirectoryProps, TextureDirectoryProps} from "../interfaces";
import {Zone} from "../enums";

interface GameWrapperProps extends CardDataProps, CardOracleProps, AssetDirectoryProps, TextureDirectoryProps, React.Props<any> {
	state: GameState;
	interaction?: InteractiveBackend;
	swapPlayers?: boolean;
}

/**
 * This component wraps around the /actual/ game component (such as TwoPlayerGame).
 * It extracts the game entities.
 */
class GameWrapper extends React.Component<GameWrapperProps, {}> {

	private hasCheckedForSwap = false;
	private swapPlayers = false;

	public render(): JSX.Element {
		var gameState = this.props.state;
		if (!gameState) {
			return <p className="joust-message">Waiting for game state&hellip; </p>;
		}

		var entityTree = gameState.getEntityTree();
		var optionTree = gameState.getOptionTree();

		// check if any entites are present
		var allEntities = gameState.getEntities();
		if (!allEntities) {
			return <p className="joust-message">Waiting for entities&hellip; </p>;
		}

		// find the game entity
		var game = allEntities.filter(GameWrapper.filterByCardType(CardType.GAME)).first();
		if (!game) {
			return <p className="joust-message">Waiting for game&hellip; </p>;
		}

		// find the players
		var players = allEntities.filter(GameWrapper.filterByCardType(CardType.PLAYER)) as Immutable.Iterable<number, PlayerEntity>;
		if (players.count() == 0) {
			return <p className="joust-message">Waiting for players&hellip; </p>;
		}

		// check if we need to swap the players
		if (!this.hasCheckedForSwap) {
			let player = players.first();
			let cards = _.toArray(entityTree.get(player.getPlayerId()).get(Zone.HAND).toJS()) as Entity[];
			if (cards.length > 0) {
				this.hasCheckedForSwap = true;
				if (cards[0].isRevealed()) {
					this.swapPlayers = true;
				}
			}
		}

		// find an end turn option
		var endTurnOption = gameState.getOptions().filter(function(option: Option): boolean {
			return !!option && option.getType() === OptionType.END_TURN;
		}).first();

		var playerCount = players.count();
		switch (playerCount) {
			case 2:
				let player1 = players.first();
				let player2 = players.last();
				if (this.swapPlayers !== this.props.swapPlayers) { // XOR
					[player1, player2] = [player2, player1];
				}
				return <TwoPlayerGame
					entity={game}
					player1={player1}
					player2={player2}
					entities={entityTree}
					options={optionTree}
					endTurnOption={endTurnOption}
					optionCallback={this.props.interaction && this.props.interaction.sendOption.bind(this.props.interaction) }
					cards={this.props.cards}
					cardOracle={this.props.cardOracle}
					assetDirectory={this.props.assetDirectory}
					textureDirectory={this.props.textureDirectory}
					/>;
			default:
				return <div>Unsupported player count ({playerCount}).</div>
		}
	}

	public static filterByCardType(cardType: CardType): (entity: Entity) => boolean {
		return function(entity: Entity): boolean {
			return !!entity && entity.getCardType() === cardType;
		};
	};
}

export default GameWrapper;
