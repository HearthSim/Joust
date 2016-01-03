/// <reference path='../node_modules/immutable/dist/immutable.d.ts'/>

import Entity = require('./Entity');
import Option = require('./Option');

export interface EntityListProps {
	entities: Immutable.Iterable<number, Entity>;
	options?: Immutable.Iterable<number, Option>;
}

export interface EntityProps {
	entity: Entity;
}

export interface OptionProps {
	option: Option;
}
