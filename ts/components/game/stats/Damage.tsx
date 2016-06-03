import * as React from "react";

interface DamageProps extends React.Props<any> {
	damage: number;
}

class Damage extends React.Component<DamageProps, {}> {
	public render(): JSX.Element {
		return <div className='damage'>{this.props.damage > 0 ? -this.props.damage : ''}</div>;
	}
}

export default Damage;
