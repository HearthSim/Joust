import * as React from "react";

interface HealthProps extends React.Props<any> {
	cost: number;
	default?: number;
}

class Cost extends React.Component<HealthProps, {}> {
	public render():JSX.Element {
		var classNames = ['cost'];
		if (this.props.default !== null) {
			if (this.props.cost < this.props.default) {
				classNames.push('positive');
			}
			else if (this.props.cost > this.props.default) {
				classNames.push('negative');
			}
		}
		return <div className={classNames.join(' ')}>{this.props.cost}</div>;
	}
}

export default Cost;