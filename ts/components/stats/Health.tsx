/// <reference path="../../../typings/react/react.d.ts"/>

import * as React from 'react';

interface HealthProps extends React.Props<any> {
	health: number;
	damage: number;
	default?: number;
}

class Health extends React.Component<HealthProps, {}> {
	public render() {
		var classNames = ['health'];
		if (this.props.damage > 0) {
			classNames.push('negative');
		}
		else if (this.props.default !== null && this.props.health > this.props.default) {
			classNames.push('positive');
		}
		return <div className={classNames.join(' ')}>{this.props.health - this.props.damage}</div>;
	}
}

export default Health;