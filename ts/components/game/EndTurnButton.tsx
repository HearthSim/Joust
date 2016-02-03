import * as React from "react";

import {OptionProps} from "../../interfaces";

interface EndTurnButtonProps extends OptionProps, React.Props<any> {
	onlyOption?:boolean;
}

class EndTurnButton extends React.Component<EndTurnButtonProps, {}> {

	public endTurn() {
		if (!this.props.option || !this.props.optionCallback) {
			return;
		}
		this.props.optionCallback(this.props.option);
	}

	public render():JSX.Element {
		var classNames = ['endTurnButton'];
		if (this.props.option) {
			classNames.push('playable');
		}
		if (this.props.onlyOption) {
			classNames.push('only-option');
		}
		return (
			<div className={classNames.join(' ')}>
				<button disabled={!this.props.option} onClick={this.endTurn.bind(this)}>End Turn</button>
			</div>
		);
	}
}

export default EndTurnButton;