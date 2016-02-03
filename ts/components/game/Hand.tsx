import * as React from "react";

import EntityList from './EntityList';
import Entity from "../../Entity";
import Option from "../../Option";
import Card from './Card';

class Hand extends EntityList {

	protected className():string {
		return 'hand';
	}

	protected totalEntities:number;

	protected beforeRender(entities:number) {
		this.totalEntities = entities;
	}

	protected renderEntity(entity:Entity, option:Option, index?:number) {

		var style = {};

		/*if (typeof index === 'number' && this.totalEntities > 0) {
			let total = this.totalEntities * 1 + 10;
			let deg = index * (total / (this.totalEntities - 1)) - total / 2;
			let px = (total - Math.abs(deg));

			style['transform'] = 'rotate(' + deg + 'deg) translateY(' + '-' + px + '%)';
		}*/

		return (<Card entity={entity} option={option} style={style} optionCallback={this.props.optionCallback}
					  cards={this.props.cards}/>);
	}
}

export default Hand;
