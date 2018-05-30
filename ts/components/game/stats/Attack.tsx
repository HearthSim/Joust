import * as React from "react";

interface AttackProps extends React.ClassAttributes<Attack> {
	attack: number;
	default?: number;
}

export default class Attack extends React.Component<AttackProps> {
	public render(): JSX.Element {
		const classNames = ["atk"];
		if (
			this.props.attack !== null &&
			this.props.default !== null &&
			this.props.attack > this.props.default
		) {
			classNames.push("positive");
		}
		return (
			<div className={classNames.join(" ")}>
				{this.props.attack !== null ? this.props.attack : "?"}
			</div>
		);
	}
}
