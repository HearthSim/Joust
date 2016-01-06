/// <reference path="../../../typings/react/react.d.ts"/>
'use strict';

import React = require('react');

interface DurabilityProps extends React.Props<any> {
	durability: number;
	damage: number;
	default?: number;
}

class Durability extends React.Component<DurabilityProps, {}> {
	public render() {
		var classNames = ['durability'];
		if (this.props.damage > 0) {
			classNames.push('negative');
		}
		else if (this.props.default !== null && this.props.durability > this.props.default) {
			classNames.push('positive');
		}
		return <div className={classNames.join(' ')}>{this.props.durability - this.props.damage}</div>;
	}
}

export = Durability;