/// <reference path="../../typings/react/react-global.d.ts"/>
'use strict';

import {EntityProps} from "../interfaces";

interface MinionProps extends EntityProps, React.Props<any> {

}

class Minion extends React.Component<MinionProps, {}> {

	public render() {
		var entity = this.props.entity;
		var healthClasses = entity.getDamage() > 0 ? 'health damaged' : 'health';
		return (
			<div className="minion">
				<div className="stats">
					<div className="atk">{entity.getAtk()}</div>
					<div className={healthClasses}>{entity.getHealth() - entity.getDamage()}</div>
				</div>
			</div>
		);
	}
}

export = Minion;
