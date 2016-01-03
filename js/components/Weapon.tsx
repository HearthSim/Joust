/// <reference path="../../typings/react/react.d.ts"/>
'use strict';

import React = require('react');
import {EntityProps} from "../interfaces";

interface WeaponProps extends EntityProps, React.Props<any> {

}

class Weapon extends React.Component<WeaponProps, {}> {

	public render() {
		if(this.props.entity) {
			var entity = this.props.entity;
			var durabilityClasses = entity.getDamage() > 0 ? 'durability damaged' : 'durability';
			return (
				<div className="weapon">
					<div className="stats">
						<div className="atk">{entity.getAtk()}</div>
						<div className={durabilityClasses}>{entity.getDurability() - entity.getDamage()}</div>
					</div>
				</div>
			);
		}
		else {
			return (
				<div className="weapon no-entity"></div>
			);
		}
	}
}

export = Weapon;
