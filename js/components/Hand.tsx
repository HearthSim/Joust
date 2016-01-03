'use strict';

import React = require('react');

import EntityList = require('./EntityList');
import Entity = require('../Entity');
import Option = require('../Option');
import Card = require('./Card');

class Hand extends EntityList {

	protected className():string {
		return 'hand';
	}

	protected renderEntity(entity:Entity, option:Option) {
		return (<Card entity={entity} option={option} />);
	}
}

export = Hand;
