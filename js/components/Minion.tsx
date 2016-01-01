/// <reference path="../../typings/react/react-global.d.ts"/>
'use strict';

import {EntityProps} from "../interfaces";

interface MinionProps extends EntityProps, React.Props<any> {

}

class Minion extends React.Component<MinionProps, {}> {

	public render() {
		var entity = this.props.entity;
		return (
			<span>Minion #{entity.getId()}</span>
		);
	}
}

export = Minion;
