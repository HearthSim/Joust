import * as React from "react";

import EntityList from "./EntityList";
import Entity from "../../Entity";
import Secret from "./Secret";
import {EntityListProps} from "../../interfaces";

class Secrets extends EntityList<EntityListProps> {

	protected className(): string {
		return 'secrets';
	}

	public render(): JSX.Element {
		if(!this.props.entities || !this.props.entities.count()) {
			return null;
		}

		var entities = this.props.entities.toList().sortBy(this.sort.bind(this));

		return <Secret entity={entities.first()} cards={this.props.cards} assetDirectory={this.props.assetDirectory}
					   textureDirectory={this.props.textureDirectory}/>;
	}
}

export default Secrets;
