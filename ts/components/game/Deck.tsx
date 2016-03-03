import * as React from "react";
import EntityList from './EntityList';

class Deck extends EntityList {

	public render():JSX.Element {
		var tooltip = null;
		var image = null;
		var classNames = ['deck', 'tooltip'];
		var size = this.props.entities.size;

		if (size == 0) {
			image = "deck_0.png";
			tooltip = 'No cards remaining';
			classNames.push('fatigue');
		} else if (size == 1) {
			image = "deck_1.png";
			tooltip = '1 card remaining';
		} else if (size > 1 && size <= 7) {
			image = "deck_25.png";
		} else if (size > 7 && size <= 15) {
			image = "deck_50.png";
		} else if (size > 15 && size <= 22) {
			image = "deck_75.png";
		} else if (size > 22) {
			image = "deck_100.png";
		}

		if (!tooltip) {
			tooltip = size + ' cards remaining';
		}

		return (
			<div className={classNames.join(' ')} data-title={tooltip}>
				<img src={this.props.assetDirectory + 'images/' + image}/>
			</div>
		);
	}
}

export default Deck;
