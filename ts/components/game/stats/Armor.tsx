import * as React from "react";

interface ArmorProps extends React.Props<any> {
	armor: number;
}

class Armor extends React.Component<ArmorProps, {}> {
	public render(): JSX.Element {
		return <div className="armor">{this.props.armor}</div>;
	}
}

export default Armor;
