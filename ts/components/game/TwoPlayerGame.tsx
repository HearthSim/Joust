import * as React from "react";
import * as Immutable from "immutable";

import {
	AssetDirectoryProps,
	CardDataProps,
	CardOracleProps,
	EntityProps,
	GameStateDescriptorStackProps,
	HideCardsProps,
	MulliganOracleProps,
	OptionCallbackProps,
	StripBattletagsProps,
} from "../../interfaces";
import Entity from "../../Entity";
import Player from "./Player";
import Option from "../../Option";
import PlayerEntity from "../../Player";
import EndTurnButton from "./EndTurnButton";
import { GameTag } from "../../enums";
import Choices from "../../Choices";

interface TwoPlayerGameProps
	extends EntityProps,
		CardDataProps,
		CardOracleProps,
		MulliganOracleProps,
		OptionCallbackProps,
		AssetDirectoryProps,
		GameStateDescriptorStackProps,
		HideCardsProps,
		StripBattletagsProps,
		React.ClassAttributes<TwoPlayerGame> {
	player1: PlayerEntity;
	player2: PlayerEntity;
	entities: Immutable.Map<
		number,
		Immutable.Map<number, Immutable.Map<number, Entity>>
	>;
	options: Immutable.Map<
		number,
		Immutable.Map<number, Immutable.Map<number, Option>>
	>;
	choices: Immutable.Map<number, Choices>;
	endTurnOption?: Option;
}

export default class TwoPlayerGame extends React.Component<TwoPlayerGameProps> {
	public render(): JSX.Element {
		const entities = this.props.entities;
		const options = this.props.options;
		const player1 = this.props.player1 as PlayerEntity;
		const player2 = this.props.player2 as PlayerEntity;
		const currentPlayer = player1.getTag(GameTag.CURRENT_PLAYER)
			? player1
			: player2;

		const emptyEntities = Immutable.Map<
			number,
			Immutable.Map<number, Entity>
		>();
		const emptyOptions = Immutable.Map<
			number,
			Immutable.Map<number, Option>
		>();
		return (
			<div className="game">
				<Player
					player={player1 as PlayerEntity}
					isTop
					isCurrent={currentPlayer === player1}
					entities={entities.get(player1.playerId) || emptyEntities}
					options={options.get(player1.playerId) || emptyOptions}
					choices={this.props.choices.get(player1.id)}
					optionCallback={this.props.optionCallback}
					cardOracle={this.props.cardOracle}
					mulliganOracle={this.props.mulliganOracle}
					cards={this.props.cards}
					cardsByDbfId={this.props.cardsByDbfId}
					descriptors={this.props.descriptors}
					assetDirectory={this.props.assetDirectory}
					cardArtDirectory={this.props.cardArtDirectory}
					hideCards={this.props.hideCards}
					stripBattletags={this.props.stripBattletags}
				/>
				{this.props.optionCallback && (
					<EndTurnButton
						option={this.props.endTurnOption}
						optionCallback={this.props.optionCallback}
						onlyOption={options.count() === 0}
						currentPlayer={currentPlayer}
					/>
				)}
				<Player
					player={player2 as PlayerEntity}
					isTop={false}
					isCurrent={currentPlayer === player2}
					entities={entities.get(player2.playerId) || emptyEntities}
					options={options.get(player2.playerId) || emptyOptions}
					choices={this.props.choices.get(player2.id)}
					optionCallback={this.props.optionCallback}
					cardOracle={this.props.cardOracle}
					mulliganOracle={this.props.mulliganOracle}
					cards={this.props.cards}
					cardsByDbfId={this.props.cardsByDbfId}
					descriptors={this.props.descriptors}
					assetDirectory={this.props.assetDirectory}
					cardArtDirectory={this.props.cardArtDirectory}
					stripBattletags={this.props.stripBattletags}
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
			this.props.cards !== nextProps.cards ||
			this.props.cardsByDbfId !== nextProps.cardsByDbfId ||
			this.props.descriptors !== nextProps.descriptors ||
			this.props.hideCards !== nextProps.hideCards
		);
	}
}
