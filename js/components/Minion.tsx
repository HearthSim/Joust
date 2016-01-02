/// <reference path="../../typings/react/react-global.d.ts"/>
'use strict';

import {EntityProps, OptionProps} from "../interfaces";

interface MinionProps extends EntityProps, OptionProps, React.Props<any> {

}

class Minion extends React.Component<MinionProps, {}> {

	public render() {
		var classNames = ['minion'];
		if (this.props.option) {
			classNames.push('playable');
		}
		var entity = this.props.entity;
		var healthClasses = entity.getDamage() > 0 ? 'health damaged' : 'health';
		return (
			<div className={classNames.join(' ')}>
				<div className="stats">
					<div className="atk">{entity.getAtk()}</div>
					<div className={healthClasses}>{entity.getHealth() - entity.getDamage()}</div>
				</div>
			</div>
		);
	}
}

export = Minion;
