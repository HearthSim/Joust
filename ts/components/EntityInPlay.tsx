import {EntityInPlayProps} from '../interfaces';

import * as React from 'react';
import {DragSource, DropTarget} from 'react-dnd';
import * as _ from 'lodash';

abstract class EntityInPlay<P extends EntityInPlayProps, S> extends React.Component<P, S> {

	private baseClassName:string = '';

	protected abstract jsx();

	constructor(baseClassName:string) {
		super();
		this.baseClassName = baseClassName;
	}

	protected playWithClick():boolean {
		return false;
	}

	protected getClassNames():string[] {
		var classNames = ['entity', 'in-play'];
		classNames.push(this.baseClassName);
		if (this.props.isTarget) {
			classNames.push('target');
		}
		else if (this.props.option) {
			classNames.push('playable');
		}
		if (this.props.entity) {
			if (this.props.entity.isExhausted()) {
				classNames.push('exhausted');
			}
			if (this.props.entity.isStealthed()) {
				classNames.push('stealth');
			}
			if (this.props.entity.isDivineShielded()) {
				classNames.push('divine-shield');
			}
			if (this.props.entity.isTaunter()) {
				classNames.push('taunt');
			}
			if (this.props.entity.isFrozen()) {
				classNames.push('frozen');
			}
		}
		return classNames;
	}

	public click(e) {
		e.preventDefault();
		this.props.optionCallback(this.props.option);
	}

	public render() {
		if (!this.props.entity) {
			return <div className={this.getClassNames().concat(['no-entity']).join(' ')}></div>;
		}

		var playable = !!this.props.option;
		var requiresTarget = this.props.option && this.props.option.hasTargets();

		var jsx = null;
		if (playable && !requiresTarget && this.playWithClick()) {
			jsx = <div className={this.getClassNames().join(' ')} onClick={this.click.bind(this)}>{this.jsx()}</div>
		}
		else {
			jsx = <div className={this.getClassNames().join(' ')}>{this.jsx()}</div>;
			if (playable) {
				// make draggable
				jsx = this.props.connectDragSource(jsx);
			}
		}

		// make drop target
		jsx = this.props.connectDropTarget(jsx);

		return jsx;
	}

	public static DragSource() {
		return DragSource<EntityInPlayProps>('card', {
				beginDrag: function (props:EntityInPlayProps) {
					return {
						option: props.option,
						action: props.optionCallback
					};
				}
			},
			function (connect, monitor) {
				return {
					connectDragSource: connect.dragSource(),
					isDragging: monitor.isDragging()
				}
			});
	}

	public static DropTarget() {
		return DropTarget<EntityInPlayProps>('card', {
				canDrop: function (props:EntityInPlayProps, monitor) {
					var item = monitor.getItem();
					return item.option.isTarget(props.entity.getId());
				},
				drop: function (props:EntityInPlayProps, monitor, component) {
					var item = monitor.getItem();
					item.action(item.option, props.entity.getId());
				}
			},
			function (connect, monitor) {
				return {
					connectDropTarget: connect.dropTarget(),
					isTarget: monitor.canDrop(),
					isOver: monitor.isOver()
				}
			})
	}
}

export default EntityInPlay;