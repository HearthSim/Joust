/// <reference path="../../../typings/react/react.d.ts"/>
'use strict';

import React = require('react');

interface ArmorProps extends React.Props<any> {
	armor: number;
}

class Armor extends React.Component<ArmorProps, {}> {
	public render() {
		return <div className="armor">{this.props.armor}</div>;
	}
}

export = Armor;