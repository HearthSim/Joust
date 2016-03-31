import * as React from "react";

import {EntityListProps} from "../../interfaces";
import Entity from "../../Entity";
import Option from "../../Option";

abstract class EntityList<T extends EntityListProps> extends React.Component<T, {}> {

	protected renderEntity(entity: Entity, option: Option, index?: number) {
		var id = entity.getCardId() ? (' (CardID=' + entity.getCardId() + ')') : '';
		return (<span>Entity #{entity.getId() }{id}</span>);
	}

	protected sort(entity: Entity): number {
		return entity.getZonePosition();
	}

	protected beforeRender(entities: number) { }

	protected abstract className(): string;

	public render(): JSX.Element {
		var elements = [];
		if (this.props.entities) {
			var entities = this.props.entities.toList().sortBy(this.sort.bind(this));
			this.beforeRender(entities.count());
			entities.forEach(function(entity, i) {
				var option = this.props.options ? this.props.options.get(entity.getId()) : null;
				elements.push(
					<li key={entity.getId() }>
						{this.renderEntity(entity, option, i) }
					</li>);
			}.bind(this));
		}
		let classNames = ['entity-list'];
		classNames.push(this.className());
		return (
			<ul className={classNames.join(' ') }>
				{elements}
			</ul>
		);
	}

	public shouldComponentUpdate(nextProps: EntityListProps, nextState) {
		return (
			this.props.entities !== nextProps.entities ||
			this.props.options !== nextProps.options ||
			this.props.optionCallback !== nextProps.optionCallback ||
			this.props.cardOracle !== nextProps.cardOracle ||
			this.props.cards !== nextProps.cards
		);
	}
}

export default EntityList;
