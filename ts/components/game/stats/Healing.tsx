import * as React from "react";

interface HealingProps extends React.Props<any> {
	healing: number;
}

class Healing extends React.Component<HealingProps, {}> {
	public render(): JSX.Element {
		return <div className='healing'>{this.props.healing > 0 ? '+' + this.props.healing : ''}</div>;
	}
}

export default Healing;
