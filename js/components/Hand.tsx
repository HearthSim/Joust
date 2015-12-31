'use strict';

import EntityList = require('./EntityList');
import Entity = require('../Entity');
import Card = require('./Card');

class Hand extends EntityList {

	protected renderEntity(entity:Entity) {
		return (<Card entity={entity}/>);
	}
}

export = Hand;
