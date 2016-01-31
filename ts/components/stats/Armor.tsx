/// <reference path="../../../typings/react/react.d.ts"/>

import * as React from 'react';

interface ArmorProps extends React.Props<any> {
	armor: number;
}

class Armor extends React.Component<ArmorProps, {}> {
	public render() {
		return <div className="armor">{this.props.armor}</div>;
	}
}

export default Armor;