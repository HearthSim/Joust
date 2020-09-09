import * as React from "react";
import GameState from "../state/GameState";
import { GameTag } from "../enums";
import { isBattlegrounds } from "../utils";

interface TurnProps extends React.ClassAttributes<Turn> {
	state?: GameState;
	mulligan?: boolean;
	totalDuration: number;
	duration: number;
	turnNumber?: number;
	invert?: boolean;
}

export default class Turn extends React.Component<TurnProps> {
	public render(): JSX.Element {
		if (!this.props.totalDuration) {
			return null;
		}

		const classNames = ["joust-scrubber-turn"];

		const width = (100 / this.props.totalDuration) * this.props.duration;
		const style = { width: width + "%" };

		if (this.props.state) {
			let flip = 0;
			const player = this.props.state.getPlayer(1);
			if (player) {
				flip += player.getTag(GameTag.FIRST_PLAYER) ? 1 : 0;
			}
			if (this.props.invert) {
				flip += 1;
			}
			const game = this.props.state.game;
			if (game) {
				if (isBattlegrounds(game.type)) {
					// Battlegrounds always incorrectly has Bobs as FIRST_PLAYER
					flip += 1;
				}
				classNames.push(
					(game.getTag(GameTag.TURN) + flip) % 2 === 1
						? "top"
						: "bottom",
				);
			}
		} else if (this.props.mulligan) {
			classNames.push("mulligan");
		}

		const prettyTurn =
			this.props.turnNumber % 2
				? Math.floor(this.props.turnNumber / 2) + 1
				: null;
		if (prettyTurn) {
			classNames.push("text");
			classNames.push(prettyTurn % 2 ? "odd" : "even");
		}

		return (
			<section className={classNames.join(" ")} style={style}>
				{this.props.mulligan ? "M" : prettyTurn}
			</section>
		);
	}
}
