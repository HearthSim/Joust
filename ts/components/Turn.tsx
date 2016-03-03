import * as React from "react";
import GameState from "../state/GameState";
import {GameTag} from "../enums";

interface TurnProps extends React.Props<any> {
	state?: GameState;
	mulligan?: boolean;
	totalDuration: number;
	duration: number;
}

class Turn extends React.Component<TurnProps, {}> {
	public render():JSX.Element {
		if (!this.props.totalDuration) {
			return null;
		}

		let classNames = ['joust-scrubber-turn'];

		let width = 100 / this.props.totalDuration * this.props.duration;
		let style = {width: width + '%'};

		if (this.props.state) {
			classNames.push(this.props.state.getEntity(1).getTag(GameTag.TURN) % 2 ? 'primary' : 'secondary');
		} else if (this.props.mulligan) {
			classNames.push('mulligan');
		}

		return <div className={classNames.join(' ')} style={style}></div>;
	}
}

export default Turn;
