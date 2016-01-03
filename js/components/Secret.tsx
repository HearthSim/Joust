/// <reference path="../../typings/react/react-global.d.ts"/>
'use strict';

import {EntityProps} from "../interfaces";

interface SecretProps extends EntityProps, React.Props<any> {

}

class Secret extends React.Component<SecretProps, {}> {

	public render() {
		var entity = this.props.entity;
		var classNames = ['secret'];
		var classes = {3: 'hunter', 4: 'mage', 5: 'paladin'};
		var secretClass = classes[this.props.entity.getClass()];
		if (secretClass) {
			classNames.push(secretClass);
		}
		return (
			<div className={classNames.join(' ')}>?</div>
		);
	}
}

export = Secret;
