import * as React from "react";
import {EntityProps} from "../../interfaces";
import Attack from './stats/Attack';
import Durability from './stats/Durability';
import WeaponArt from './visuals/WeaponArt';

interface WeaponProps extends EntityProps, React.Props<any> {

}

class Weapon extends React.Component<WeaponProps, {}> {

	public render():JSX.Element {
		if (this.props.entity) {
			var entity = this.props.entity;

			var title = entity.getCardId();
			var defaultAttack = null;
			var defaultDurability = null;
			if (this.props.cards && this.props.cards.has(entity.getCardId())) {
				var data = this.props.cards.get(entity.getCardId());
				var title = '' + data.name;
				defaultAttack = data.attack;
				defaultDurability = data.durability;
			}

			return (
				<div className="weapon">
					<WeaponArt entity={this.props.entity} assetDirectory={this.props.assetDirectory}/>
					<div className="stats">
						<Attack attack={entity.getAtk()} default={defaultAttack}/>
						<Durability durability={entity.getDurability()} damage={entity.getDamage()}
									default={defaultDurability}/>
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

export default Weapon;
