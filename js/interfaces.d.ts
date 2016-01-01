/// <reference path="../typings/react/react-global.d.ts"/>
/// <reference path='../node_modules/immutable/dist/immutable.d.ts'/>

import Entity = require('./Entity');
import Player = require('./Player');
import GameState = require('./state/GameState');

export interface EntityListProps {
	entities: Immutable.Iterable<number, Entity>;
}

export interface EntityProps {
	entity: Entity;
}
