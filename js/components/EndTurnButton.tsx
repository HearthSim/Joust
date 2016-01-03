/// <reference path="../../typings/react/react.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
'use strict';

import React = require('react');

import {OptionProps} from "../interfaces";

interface EndTurnButtonProps extends OptionProps, React.Props<any> {
	callback?;
	onlyOption?:boolean;
}

class EndTurnButton extends React.Component<EndTurnButtonProps, {}> {
	public render() {
		var classNames = ['endTurnButton'];
		if(this.props.option) {
			classNames.push('playable');
		}
		if(this.props.onlyOption) {
			classNames.push('only-option');
		}
		return (
			<div className={classNames.join(' ')}>
				<button disabled={!this.props.callback} onClick={this.props.callback}>End Turn</button>
			</div>
		);
	}
}

export = EndTurnButton;