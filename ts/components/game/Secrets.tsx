import * as React from "react";

import EntityList from './EntityList';
import Entity from "../../Entity";
import Secret from './Secret';

class Secrets extends EntityList {

	protected className(): string {
		return 'secrets';
	}

	protected renderEntity(entity: Entity) {
		return (<Secret entity={entity} cards={this.props.cards} assetDirectory={this.props.assetDirectory} textureDirectory={this.props.textureDirectory}/>);
	}
}

export default Secrets;
