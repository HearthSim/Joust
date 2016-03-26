import * as React from "react";

interface AttackProps extends React.Props<any> {
	attack: number;
	default?: number;
}

class Attack extends React.Component<AttackProps, {}> {
	public render(): JSX.Element {
		var classNames = ['atk'];
		if (this.props.attack !== null && this.props.default !== null && this.props.attack > this.props.default) {
			classNames.push('positive');
		}
		return <div className={classNames.join(' ') }>{this.props.attack !== null ? this.props.attack : '?'}</div>;
	}
}

export default Attack;
