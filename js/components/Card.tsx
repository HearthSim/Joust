/// <reference path="../../typings/react/react-global.d.ts"/>
'use strict';

import {EntityProps} from "../interfaces";

interface CardProps extends EntityProps, React.Props<any> {

}

class Card extends React.Component<CardProps, {}> {

	public render() {
		var entity = this.props.entity;
		return (
			<span>Card #{entity.getId()}</span>
		);
	}
}

export = Card;
