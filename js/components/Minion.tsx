'use strict';

import EntityList = require('./EntityList');
import Minion = require('./Minion');

class Deck extends EntityList {

	public render() {
		var elements = [];
		if (this.props.entities) {
			var entities = this.props.entities.sortBy(function (entity) {
				return entity.getZonePosition();
			});
			entities.map(function (entity) {
				return <Minion  key={entity.getId()} entity={entity}/>;
			});
		}
		return (
			<div>
				{entities}
			</div>
		);
	}
}

export = Deck;
