import * as React from 'react';

import EntityList from './EntityList';
import Entity from '../Entity';
import Option from '../Option';
import Card from './Card';

class Hand extends EntityList {

	protected className():string {
		return 'hand';
	}

	protected renderEntity(entity:Entity, option:Option) {
		return (<Card entity={entity} option={option} optionCallback={this.props.optionCallback}/>);
	}
}

export default Hand;
