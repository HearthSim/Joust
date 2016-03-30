import * as React from "react";
import * as Immutable from "immutable";

import {EntityProps, OptionCallbackProps, CardDataProps, CardOracleProps, AssetDirectoryProps, TextureDirectoryProps} from "../../interfaces";
import Entity from "../../Entity";
import Player from "./Player";
import Option from "../../Option";
import PlayerEntity from "../../Player";
import EndTurnButton from "./EndTurnButton";
import {DragDropContext} from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import {GameTag} from "../../enums";
import Choice from "../../Choice";
import Choices from "../../Choices";

interface TwoPlayerGameProps extends EntityProps, CardDataProps, CardOracleProps, OptionCallbackProps, AssetDirectoryProps, React.Props<any> {
	player1: PlayerEntity;
	player2: PlayerEntity;
	entities: Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Entity>>>;
	options: Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Option>>>;
	choices: Immutable.Map<number, Choices>;
	endTurnOption?: Option;
}

class TwoPlayerGame extends React.Component<TwoPlayerGameProps, {}> {

	public render(): JSX.Element {
		var entities = this.props.entities;
		var options = this.props.options;
		var player1 = this.props.player1 as PlayerEntity;
		var player2 = this.props.player2 as PlayerEntity;
		var currentPlayer = player1.getTag(GameTag.CURRENT_PLAYER) ? player1 : player2;

		var emptyEntities = Immutable.Map<number, Immutable.Map<number, Entity>>();
		var emptyOptions = Immutable.Map<number, Immutable.Map<number, Option>>();
		return (
			<div className="game">
				<Player player={player1 as PlayerEntity} isTop={true}
					entities={entities.get(player1.getPlayerId()) || emptyEntities}
					options={options.get(player1.getPlayerId()) || emptyOptions}
					choices={this.props.choices.get(player1.getId())}
					optionCallback={this.props.optionCallback}
					cardOracle={this.props.cardOracle}
					cards={this.props.cards}
					assetDirectory={this.props.assetDirectory}
					textureDirectory={this.props.textureDirectory}
					/>
				<EndTurnButton option={this.props.endTurnOption}
					optionCallback={this.props.optionCallback} onlyOption={options.count() === 0}
					currentPlayer={currentPlayer}
					/>
				<Player player={player2 as PlayerEntity} isTop={false}
					entities={entities.get(player2.getPlayerId()) || emptyEntities}
					options={options.get(player2.getPlayerId()) || emptyOptions}
					choices={this.props.choices.get(player2.getId())}
					optionCallback={this.props.optionCallback}
					cardOracle={this.props.cardOracle}
					cards={this.props.cards}
					assetDirectory={this.props.assetDirectory}
					textureDirectory={this.props.textureDirectory}
					/>
			</div>
		);
	}

	public shouldComponentUpdate(nextProps: TwoPlayerGameProps, nextState) {
		return (
			this.props.entity !== nextProps.entity ||
			this.props.player1 !== nextProps.player1 ||
			this.props.player2 !== nextProps.player2 ||
			this.props.entities !== nextProps.entities ||
			this.props.options !== nextProps.options ||
			this.props.choices !== nextProps.choices ||
			this.props.endTurnOption !== nextProps.endTurnOption ||
			this.props.optionCallback !== nextProps.optionCallback ||
			this.props.cardOracle !== nextProps.cardOracle ||
			this.props.cards !== nextProps.cards
		);
	}
}

export default DragDropContext<TwoPlayerGameProps>(HTML5Backend)(TwoPlayerGame);
