import * as React from "react";
import EntityList from "./EntityList";
import {EntityListProps} from "../../interfaces";

class Deck extends EntityList<EntityListProps> {

	protected className(): string {
		return 'deck';
	}

	public render(): JSX.Element {
		var tooltip = null;
		var classNames = [this.className()];
		switch (this.props.entities.size) {
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
		return (
			<div className={classNames.join(' ') } title={tooltip}>
				<figure>
					<img src={this.props.assetDirectory + 'images/cardback.png'} />
					<figcaption>{this.props.entities.size}</figcaption>
				</figure>
			</div>);
	}
}

export default Deck;
