/// <reference path="../../typings/react/react-global.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
'use strict';

import {EntityProps} from "../interfaces";

interface HeroProps extends EntityProps, React.Props<any> {

}

class Hero extends React.Component<HeroProps, {}> {
	public render() {
		if (this.props.entity) {
			var health = null;
			var atk = null;
			if (this.props.entity.getAtk()) {
				atk = <div className="atk">{this.props.entity.getAtk()}</div>;
			}
			var currentHealth = this.props.entity.getHealth() - this.props.entity.getDamage();
			var healthClasses = this.props.entity.getDamage() > 0 ? 'health damaged' : 'health';
			health = <div className={healthClasses}>{currentHealth}</div>;
			return (
				<div className="hero">
					<div className="stats">
						{atk}
						{health}
					</div>
				</div>
			);
		}
		else {
			return <div className="hero no-entity"></div>;
		}
	}
}

export = Hero;
