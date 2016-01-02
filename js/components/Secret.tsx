/// <reference path="../../typings/react/react-global.d.ts"/>
'use strict';

import {EntityProps} from "../interfaces";

interface SecretProps extends EntityProps, React.Props<any> {

}

class Secret extends React.Component<SecretProps, {}> {

	public render() {
		var entity = this.props.entity;
		return (
			<div className="secret">
				?
			</div>
		);
	}
}

export = Secret;
