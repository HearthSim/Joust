import * as React from "react";
import {CardDataProps} from "../interfaces";
import GameState from "../state/GameState";
import TwoPlayerGame from "./game/TwoPlayerGame";
import {CardType, OptionType, GameTag} from "../enums";
import Entity from "../Entity";
import Option from "../Option";
import PlayerEntity from "../Player";
import {InteractiveBackend, CardOracleProps, AssetDirectoryProps, TextureDirectoryProps} from "../interfaces";
import {Zone} from "../enums";
import TexturePreloader from "../TexturePreloader";

interface GameWrapperProps extends CardDataProps, CardOracleProps, AssetDirectoryProps, TextureDirectoryProps, React.Props<any> {
	state: GameState;
	preloader?: TexturePreloader;
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
	private lastLog: string;
	private currentMessage: string;
	private lastUpdate = 0;
	private messages = ['Sorting decks...', 'Painting cards...', 'Calculating lethal...', 'Calling customer service...',
		'SMOrc', 'Verifying the face is the place...', 'Summoning heroes...', 'Nerfing cards...', 'Buffing cards...'];

	public render(): JSX.Element {
		var gameState = this.props.state;
		if (!gameState) {
			this.log('Waiting for game state...');
			return this.getLoadingScreen();
		}

		var entityTree = gameState.getEntityTree();
		var optionTree = gameState.getOptionTree();

		// check if any entites are present
		var allEntities = gameState.getEntities();
		if (!allEntities) {
			this.log('Waiting for entities...');
			return this.getLoadingScreen();
		}

		// find the game entity
		var game = allEntities.filter(GameWrapper.filterByCardType(CardType.GAME)).first();
		if (!game) {
			this.log('Waiting for game...');
			return this.getLoadingScreen();
		}

		// find the players
		var players = allEntities.filter(GameWrapper.filterByCardType(CardType.PLAYER)) as Immutable.Iterable<number, PlayerEntity>;
		if (players.count() == 0) {
			this.log('Waiting for players...');
			return this.getLoadingScreen(players);
		}

		if (this.props.preloader && !this.props.preloader.assetsReady()) {
			this.log('Waiting for assets...');
			return this.getLoadingScreen(players);
		}

		if (this.props.preloader && !this.props.preloader.texturesReady()) {
			this.log('Waiting for textures...');
			return this.getLoadingScreen(players);
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
					choices={gameState.getChoices()}
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

	private getLoadingScreenMessage(): string {
		var now = new Date().getTime();
		if (!!this.messages.length && (now - this.lastUpdate) > 3000) {
			var index = Math.floor(Math.random()*this.messages.length);
			this.currentMessage = this.messages.splice(index, 1)[0];
			this.lastUpdate = now;
		}
		return this.currentMessage;
	}

	private getLoadingScreen(players?: Immutable.Iterable<number, PlayerEntity>): JSX.Element {
		return 	<div className="loading-screen">{players ?
			<div className="info">
				<span className="left">{players.first().getName()}</span>
				<span className="center">VS</span>
				<span className="right">{players.last().getName()}</span>
			</div> : <div className="info"/>}
			<img className="logo" src={this.props.assetDirectory + 'images/logo.png'} />
			<span className="info joust-message">{this.getLoadingScreenMessage()}</span>
		</div>;
	}

	private log(message: string) {
		if (message != this.lastLog) {
			console.debug(message);
			this.lastLog = message;
		}
	}
}

export default GameWrapper;
