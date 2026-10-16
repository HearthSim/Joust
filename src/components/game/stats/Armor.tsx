import * as React from "react";

interface ArmorProps extends React.ClassAttributes<Armor> {
	armor: number;
}

export default class Armor extends React.Component<ArmorProps> {
	public render(): JSX.Element {
		return <div className="armor">{this.props.armor}</div>;
	}
}
