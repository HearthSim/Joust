'use strict';

import EntityList = require('./EntityList');
import Entity = require('../Entity');
import Minion = require('./Minion');

class Field extends EntityList {

	protected renderEntity(entity:Entity) {
		return (<Minion entity={entity}/>);
	}
}

export = Field;
