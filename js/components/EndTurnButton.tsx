/// <reference path="../../typings/react/react.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
'use strict';

import React = require('react');

import {OptionProps} from "../interfaces";

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

	public render() {
		var classNames = ['endTurnButton'];
		if (this.props.option) {
			classNames.push('playable');
		}
		if (this.props.onlyOption) {
			classNames.push('only-option');
		}
		return (
			<div className={classNames.join(' ')}>
				<button disabled={!this.props.optionCallback} onClick={this.endTurn.bind(this)}>End Turn</button>
			</div>
		);
	}
}

export = EndTurnButton;