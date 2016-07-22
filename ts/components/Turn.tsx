import * as React from "react";
import GameState from "../state/GameState";
import {GameTag} from "../enums";

interface TurnProps extends React.Props<any> {
	state?: GameState;
	mulligan?: boolean;
	totalDuration: number;
	duration: number;
	turnNumber?: number;
	invert?: boolean;
}

class Turn extends React.Component<TurnProps, {}> {
	public render(): JSX.Element {
		if (!this.props.totalDuration) {
			return null;
		}

		let classNames = ['joust-scrubber-turn'];

		let width = 100 / this.props.totalDuration * this.props.duration;
		let style = { width: width + '%' };

		let turn = 0;
		if (this.props.state) {
			let flip = 0;
			let players = this.props.state.getPlayers();
			if(players[0]) {
				flip += players[0].getTag(GameTag.FIRST_PLAYER) ? 1 : 0;
			}
			let game = this.props.state.game;
			if (game) {
				turn = game.getTag(GameTag.TURN);
				classNames.push((!!((game.getTag(GameTag.TURN) + flip) % 2) != this.props.invert) ? 'top' : 'bottom');
			}
		} else if (this.props.mulligan) {
			classNames.push('mulligan');
		}

		return <div className={classNames.join(' ') } style={style}>{!this.props.mulligan && (this.props.turnNumber % 2) ? Math.floor(this.props.turnNumber / 2) + 1 : null}</div>;
	}
}

export default Turn;
