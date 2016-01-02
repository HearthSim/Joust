'use strict';

import EntityList = require('./EntityList');
import Entity = require('../Entity');
import Secret = require('./Secret');

class Secrets extends EntityList {

	protected className():string {
		return 'secrets';
	}

	protected renderEntity(entity:Entity) {
		return (<Secret entity={entity}/>);
	}
}

export = Secrets;
