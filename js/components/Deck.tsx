'use strict';

import EntityList = require('./EntityList');

class Deck extends EntityList {

	public render() {
		return <p>{this.props.entities.size} card(s) in deck</p>;
	}
}

export = Deck;
