import * as React from "react";

import {EntityListProps} from "../../interfaces";
import Entity from "../../Entity";
import Option from "../../Option";

class EntityList extends React.Component<EntityListProps, {}> {

	protected renderEntity(entity:Entity, option:Option, index?:number) {
		var id = entity.getCardId() ? (' (CardID=' + entity.getCardId() + ')') : '';
		return (<span>Entity #{entity.getId()}{id}</span>);
	}

	protected beforeRender(entities:number) {}

	protected className():string {
		return 'entityList';
	}

	public render():JSX.Element {
		var elements = [];
		if (this.props.entities) {
			var entities = this.props.entities.toList().sortBy(function (entity) {
				return entity.getZonePosition();
			});
			this.beforeRender(entities.count());
			entities.forEach(function (entity, i) {
				var option = this.props.options ? this.props.options.get(entity.getId()) : null;
				elements.push(
					<li key={entity.getId()}>
						{this.renderEntity(entity, option, i)}
					</li>);
			}.bind(this));
		}
		return (
			<ul className={this.className()}>
				{elements}
			</ul>
		);
	}

	public shouldComponentUpdate(nextProps:EntityListProps, nextState) {
		return (
			this.props.entities !== nextProps.entities ||
			this.props.options !== nextProps.options ||
			this.props.optionCallback !== nextProps.optionCallback
		);
	}
}

export default EntityList;