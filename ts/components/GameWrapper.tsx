import * as React from "react";
import {CardDataProps} from "../interfaces";
import GameState from "../state/GameState";
import TwoPlayerGame from "./game/TwoPlayerGame";
import {CardType, OptionType} from "../enums";
import Entity from "../Entity";
import Option from "../Option";
import PlayerEntity from "../Player";
import {InteractiveBackend} from "../interfaces";

interface GameWrapperProps extends CardDataProps, React.Props<any> {
	state:GameState;
	interaction?:InteractiveBackend;
	swapPlayers?:boolean;
}

/**
 * This component wraps around the /actual/ game component (such as TwoPlayerGame).
 * It extracts the game entities.
 */
class GameWrapper extends React.Component<GameWrapperProps, {}> {

	public render():JSX.Element {
		var gameState = this.props.state;
		if (!gameState) {
			return <p className="message">Waiting for game state&hellip;</p>;
		}

		var entityTree = gameState.getEntityTree();
		var optionTree = gameState.getOptionTree();

		// check if any entites are present
		var allEntities = gameState.getEntities();
		if (!allEntities) {
			return <p className="message">Waiting for entities&hellip;</p>;
		}

		// find the game entity
		var game = allEntities.filter(GameWrapper.filterByCardType(CardType.GAME)).first();
		if (!game) {
			return <p className="message">Waiting for game&hellip;</p>;
		}

		// find the players
		var players = allEntities.filter(GameWrapper.filterByCardType(CardType.PLAYER)) as Immutable.Iterable<number, PlayerEntity>;

		// find an end turn option
		var endTurnOption = gameState.getOptions().filter(function (option:Option):boolean {
			return !!option && option.getType() === OptionType.END_TURN;
		}).first();

		var playerCount = players.count();
		switch (playerCount) {
			case 2:
				var player1 = players.first();
				var player2 = players.last();
				if (this.props.swapPlayers) {
					let swap = player1;
					player1 = player2;
					player2 = swap;
				}
				return <TwoPlayerGame
					entity={game}
					player1={player1}
					player2={player2}
					entities={entityTree}
					options={optionTree}
					endTurnOption={endTurnOption}
					optionCallback={this.props.interaction && this.props.interaction.sendOption.bind(this.props.interaction)}
					cards={this.props.cards}
				/>;
			default:
				return <div>Unsupported player count ({playerCount}).</div>
		}
	}

	public static filterByCardType(cardType:CardType):(entity:Entity)=>boolean {
		return function (entity:Entity):boolean {
			return !!entity && entity.getCardType() === cardType;
		};
	};
}

export default GameWrapper;