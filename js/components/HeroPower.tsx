/// <reference path="../../typings/react/react-global.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
'use strict';

import {EntityProps, OptionProps} from "../interfaces";

interface HeroPowerProps extends EntityProps, OptionProps, React.Props<any> {

}

class HeroPower extends React.Component<HeroPowerProps, {}> {
	public render() {
		if (this.props.entity) {
			var classNames = this.props.option ? 'heroPower playable' : 'heroPower';
			return (
				<div className={classNames}>
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