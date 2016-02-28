import * as React from "react";

import * as Immutable from "immutable";
import PlayerEntity from '../../Player';
import Entity from '../../Entity';
import Option from '../../Option';
import EntityList from './EntityList';
import Deck from './Deck';
import Hand from './Hand';
import Hero from './Hero';
import HeroPower from './HeroPower';
import Field from './Field';
import Weapon from './Weapon';
import Secrets from './Secrets';

import {Zone, CardType} from '../../enums'
import {OptionCallbackProps, CardDataProps, CardOracleProps, AssetDirectoryProps} from "../../interfaces";

interface PlayerProps extends OptionCallbackProps, CardDataProps, CardOracleProps, AssetDirectoryProps, React.Props<any> {
	player: PlayerEntity;
	entities: Immutable.Map<number, Immutable.Map<number, Entity>>;
	options: Immutable.Map<number, Immutable.Map<number, Option>>;
	isTop: boolean;
}

class Player extends React.Component<PlayerProps, {}> {

	public render():JSX.Element {
		var filterByCardType = function (cardType:number) {
			return function (entity:Entity):boolean {
				return !!entity && entity.getCardType() === cardType;
			};
		};

		var emptyEntities = Immutable.Map<number, Entity>();
		var emptyOptions = Immutable.Map<number, Option>();

		var playEntities = this.props.entities.get(Zone.PLAY) || Immutable.Map<number, Entity>();
		var playOptions = this.props.options.get(Zone.PLAY) || Immutable.Map<number, Option>();

		/* Equipment */
		var heroEntity = playEntities.filter(filterByCardType(CardType.HERO)).first();
		var hero = <Hero entity={heroEntity}
						 option={heroEntity ? playOptions.get(heroEntity.getId()) : null}
						 secrets={this.props.entities.get(Zone.SECRET) || Immutable.Map<number, Entity>()}
						 optionCallback={this.props.optionCallback}
						 cards={this.props.cards}
						 assetDirectory={this.props.assetDirectory}
						 controller={this.props.player}
		/>;
		var heroPowerEntity = playEntities.filter(filterByCardType(CardType.HERO_POWER)).first();
		var heroPower = <HeroPower entity={heroPowerEntity}
								   option={heroPowerEntity ? playOptions.get(heroPowerEntity.getId()) : null}
								   optionCallback={this.props.optionCallback}
								   cards={this.props.cards}
								   assetDirectory={this.props.assetDirectory}
								   controller={this.props.player}
		/>;
		var weapon = <Weapon entity={playEntities.filter(filterByCardType(CardType.WEAPON)).first()}
							 cards={this.props.cards}
							 assetDirectory={this.props.assetDirectory}
							 controller={this.props.player}
		/>;

		var field = <Field entities={playEntities.filter(filterByCardType(CardType.MINION)) || emptyEntities}
						   options={playOptions || emptyOptions}
						   optionCallback={this.props.optionCallback}
						   cards={this.props.cards}
						   assetDirectory={this.props.assetDirectory}
						   controller={this.props.player}
		/>;
		var deck = <Deck entities={this.props.entities.get(Zone.DECK) || emptyEntities}
						 options={this.props.options.get(Zone.DECK) || emptyOptions}
						 cards={this.props.cards}
						 assetDirectory={this.props.assetDirectory}
						 controller={this.props.player}
		/>;
		var hand = <Hand entities={this.props.entities.get(Zone.HAND) || emptyEntities}
						 options={this.props.options.get(Zone.HAND) || emptyOptions}
						 optionCallback={this.props.optionCallback}
						 cards={this.props.cards}
						 cardOracle={this.props.cardOracle}
						 isTop={this.props.isTop}
						 assetDirectory={this.props.assetDirectory}
						 controller={this.props.player}
		/>;
		var name = this.props.player.getName() ? <div className="name">{this.props.player.getName()}</div> : null;

		var crystals = [];
		for (let i = 0; i < this.props.player.getResources(); i++) {
			var crystalClassNames = ['crystal'];
			if (i < (this.props.player.getResources() - this.props.player.getResourcesUsed())) {
				crystalClassNames.push('full');
			}
			else {
				crystalClassNames.push('empty');
			}
			crystals.push(<div key={i} className={crystalClassNames.join(' ')}></div>);
		}
		var resources = this.props.player.getResources();
		var available = resources - this.props.player.getResourcesUsed();
		var tray = (
			<div className="tray">
				<span>{available}/{resources}</span>
				{crystals}
			</div>
		);

		var classNames = this.props.isTop ? 'player top' : 'player';

		if (this.props.isTop) {
			return (
				<div className={classNames}>
					{hand}
					<div className="equipment">
						<div>
							{name}
						</div>
						<div></div>
						<div className="middle">
							{weapon}
							{hero}
							{heroPower}
						</div>
						<div>
							{tray}
						</div>
						<div>
							{deck}
						</div>
					</div>
					{field}
				</div>
			);
		}
		else {
			return (
				<div className={classNames}>
					{field}
					<div className="equipment">
						<div>
							{name}
						</div>
						<div></div>
						<div className="middle">
							{weapon}
							{hero}
							{heroPower}
						</div>
						<div>
							{tray}
						</div>
						<div>
							{deck}
						</div>
					</div>
					{hand}
				</div>
			);
		}
	}

	public shouldComponentUpdate(nextProps:PlayerProps, nextState) {
		return (
			this.props.player !== nextProps.player ||
			this.props.entities !== nextProps.entities ||
			this.props.options !== nextProps.options ||
			this.props.optionCallback !== nextProps.optionCallback ||
			this.props.cardOracle !== nextProps.cardOracle ||
			this.props.cards !== nextProps.cards
		);
	}
}

export default Player;
