'use strict';

import React = require('react');
import EntityList = require('./EntityList');

class Deck extends EntityList {

	public render() {
		var tooltip = null;
		var classNames = ['deck'];
		switch(this.props.entities.size) {
			case 0:
				tooltip = 'No cards remaining';
				classNames.push('fatigue');
				break;
			case 1:
				tooltip = '1 card remaining';
				break;
			default:
				tooltip = this.props.entities.size + ' cards remaining';
				break;
		}
		return <div className={classNames.join(' ')} title={tooltip}></div>;
	}
}

export = Deck;
