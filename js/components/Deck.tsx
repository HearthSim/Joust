'use strict';

import EntityList = require('./EntityList');

class Deck extends EntityList {

	public render() {
		var tooltip = null;
		switch(this.props.entities.size) {
			case 0:
				tooltip = 'No cards remaining';
				break;
			case 1:
				tooltip = '1 card remaining';
				break;
			default:
				tooltip = this.props.entities.size + ' cards remaining';
				break;
		}
		return <div className="deck" title={tooltip}></div>;
	}
}

export = Deck;
