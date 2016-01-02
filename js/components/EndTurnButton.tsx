/// <reference path="../../typings/react/react-global.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
'use strict';

import {OptionProps} from "../interfaces";

interface EndTurnButtonProps extends OptionProps, React.Props<any> {
	callback;
}

class EndTurnButton extends React.Component<EndTurnButtonProps, {}> {
	public render() {
		return (
			<div className="endTurnButton">
				<button disabled={!this.props.option} onClick={this.props.callback}>End Turn</button>
			</div>
		);
	}
}

export = EndTurnButton;