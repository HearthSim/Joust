/// <reference path="../../typings/react/react.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
'use strict';

import React = require('react');

import {EntityProps, OptionProps} from "../interfaces";

interface HeroPowerProps extends EntityProps, OptionProps, React.Props<any> {

}

class HeroPower extends React.Component<HeroPowerProps, {}> {
	protected use() {
		if(!this.props.option || !this.props.optionCallback) {
			return;
		}
		this.props.optionCallback(this.props.option);
	}

	public render() {
		if (this.props.entity) {
			var classNames = ['heroPower'];
			if(this.props.option) {
				classNames.push('playable');
			}
			if(this.props.entity.isExhausted()) {
				classNames.push('exhausted');
			}
			return (
				<div className={classNames.join(' ')} onClick={this.use.bind(this)}>
					<div className="cost">{this.props.entity.getCost()}</div>
				</div>
			);
		}
		else {
			return <div className="heroPower no-entity"></div>
		}
	}
}

export = HeroPower;