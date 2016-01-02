/// <reference path="../../typings/react/react-global.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
'use strict';

import {EntityProps} from "../interfaces";

interface HeroPowerProps extends EntityProps, React.Props<any> {

}

class HeroPower extends React.Component<HeroPowerProps, {}> {
	public render() {
		if (this.props.entity) {
			return (
				<div className="heroPower">
					<div className="cost">{this.props.entity.getCost()}</div>
				</div>
			);
		}
		else {
			return <div className="heroPower no-entity"></div>
		}
	}
}

export = HeroPower;