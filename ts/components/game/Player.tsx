import * as React from "react";

import * as Immutable from "immutable";
import PlayerEntity from "../../Player";
import Entity from "../../Entity";
import Option from "../../Option";
import Choice from "../../Choice";
import ChoiceList from "../../Choices";
import Deck from "./Deck";
import Hand from "./Hand";
import Hero from "./Hero";
import HeroPower from "./HeroPower";
import Field from "./Field";
import Weapon from "./Weapon";
import Choices from "./Choices";
import Rank from "./Rank";
import Card from "./Card";

import {Zone, CardType, GameTag, ChoiceType, Mulligan, PlayState, PowSubType} from "../../enums"
import {
	OptionCallbackProps, CardDataProps, CardOracleProps, AssetDirectoryProps, CardArtDirectory,
	GameStateDescriptorProps
} from "../../interfaces";

interface PlayerProps extends OptionCallbackProps, CardDataProps, CardOracleProps, AssetDirectoryProps, CardArtDirectory, GameStateDescriptorProps, React.Props<any> {
	player: PlayerEntity;
	entities: Immutable.Map<number, Immutable.Map<number, Entity>>;
	options: Immutable.Map<number, Immutable.Map<number, Option>>;
	choices: ChoiceList;
	isTop: boolean;
	isCurrent: boolean;
}

class Player extends React.Component<PlayerProps, {}> {

	public render(): JSX.Element {
		var filterByCardType = function(cardType: number) {
			return function(entity: Entity): boolean {
				return !!entity && entity.getCardType() === cardType;
			};
		};

		var emptyEntities = Immutable.Map<number, Entity>();
		var emptyOptions = Immutable.Map<number, Option>();

		var playEntities = this.props.entities.get(Zone.PLAY) || Immutable.Map<number, Entity>();
		var playOptions = this.props.options.get(Zone.PLAY) || Immutable.Map<number, Option>();

		/* Equipment */
		var heroEntity = playEntities.filter(filterByCardType(CardType.HERO)).first();
		if (!heroEntity) {
			heroEntity = (this.props.entities.get(Zone.GRAVEYARD) || Immutable.Map<number, Entity>()).filter(filterByCardType(CardType.HERO)).first();
		}
		var hero = <Hero entity={heroEntity}
			option={heroEntity ? playOptions.get(heroEntity.getId()) : null}
			secrets={this.props.entities.get(Zone.SECRET) || Immutable.Map<number, Entity>() }
			optionCallback={this.props.optionCallback}
			cards={this.props.cards}
			assetDirectory={this.props.assetDirectory}
			cardArtDirectory={this.props.cardArtDirectory}
			controller={this.props.player}
			/>;
		var heroPowerEntity = playEntities.filter(filterByCardType(CardType.HERO_POWER)).first();
		var heroPower = <HeroPower entity={heroPowerEntity}
			option={heroPowerEntity ? playOptions.get(heroPowerEntity.getId()) : null}
			optionCallback={this.props.optionCallback}
			cards={this.props.cards}
			assetDirectory={this.props.assetDirectory}
			cardArtDirectory={this.props.cardArtDirectory}
			controller={this.props.player}
			/>;
		var weapon = <Weapon entity={playEntities.filter(filterByCardType(CardType.WEAPON)).first() }
			cards={this.props.cards}
			assetDirectory={this.props.assetDirectory}
			cardArtDirectory={this.props.cardArtDirectory}
			controller={this.props.player}
			/>;

		var field = <Field entities={playEntities.filter(filterByCardType(CardType.MINION)) || emptyEntities}
			options={playOptions || emptyOptions}
			optionCallback={this.props.optionCallback}
			cards={this.props.cards}
			assetDirectory={this.props.assetDirectory}
			cardArtDirectory={this.props.cardArtDirectory}
			controller={this.props.player}
			/>;
		var deck = <Deck entities={this.props.entities.get(Zone.DECK) || emptyEntities}
			options={this.props.options.get(Zone.DECK) || emptyOptions}
			cards={this.props.cards}
			assetDirectory={this.props.assetDirectory}
			cardArtDirectory={this.props.cardArtDirectory}
			controller={this.props.player}
			fatigue={this.props.player.getTag(GameTag.FATIGUE) + 1}
			/>;
		var hand = <Hand entities={((!this.props.choices || this.props.choices.getType() !== ChoiceType.MULLIGAN) && this.props.entities.get(Zone.HAND)) || emptyEntities}
			options={this.props.options.get(Zone.HAND) || emptyOptions}
			optionCallback={this.props.optionCallback}
			cards={this.props.cards}
			cardOracle={this.props.cardOracle}
			isTop={this.props.isTop}
			assetDirectory={this.props.assetDirectory}
			cardArtDirectory={this.props.cardArtDirectory}
			controller={this.props.player}
			/>;
		var name = this.props.player.getName() ? <div className="name">{this.props.player.getName() }</div> : null;
		var choices = null;
		if(this.props.choices) {
			let choiceEntities = this.props.choices.getChoices().map((choice:Choice) => {
				var entity = null;
				// search for the entity in all player zones
				let id = choice.getEntity();
				this.props.entities.forEach((zoneEntities:Immutable.Map<number, Entity>) => {
					if (zoneEntities.has(id)) {
						entity = zoneEntities.get(id);
					}
				});
				if(entity === null) {
					console.error('Entity #' + id + ' from choice could not be found for player #' + this.props.player.getId() + ' (playerId=' + this.props.player.getPlayerId() + ')');
				}
				return entity;
			});
			choices = <Choices entities={choiceEntities}
							   cards={this.props.cards}
							   cardOracle={this.props.cardOracle}
							   isTop={this.props.isTop}
							   assetDirectory={this.props.assetDirectory}
							   cardArtDirectory={this.props.cardArtDirectory}
							   controller={this.props.player}
							   isMulligan={this.props.choices.getType() === ChoiceType.MULLIGAN}
							   choices={this.props.choices && this.props.choices.getChoices()}
			/>;
		}

		var rank = <Rank rank={this.props.player.getRank() }
			legendRank={this.props.player.getLegendRank() }
			assetDirectory={this.props.assetDirectory}
			cardArtDirectory={this.props.cardArtDirectory}
			/>;

		var crystals = [];
		let resources = this.props.player.getTag(GameTag.RESOURCES) + this.props.player.getTag(GameTag.TEMP_RESOURCES);
		let available = resources - this.props.player.getTag(GameTag.RESOURCES_USED);
		for (let i = 0; i < this.props.player.getTag(GameTag.MAXRESOURCES); i++) {
			var crystalClassNames = ['crystal'];
			if (i < available) {
				crystalClassNames.push('full');
			}
			else if (i < resources) {
				if (i >= resources - this.props.player.getTag(GameTag.OVERLOAD_LOCKED)) {
					crystalClassNames.push('locked');
				}
				else {
					crystalClassNames.push('empty');
				}
			}
			else {
				crystalClassNames.push('hidden');
			}
			crystals.push(<img src={this.props.assetDirectory + 'images/mana_crystal.png'} key={i} className={crystalClassNames.join(' ') }></img>);
		}
		var tray = (
			<div className="tray">
				<span>{available}/{resources}</span>
				{crystals}
			</div>
		);

		let tall = <section className="tall">
			<div className="equipment">
				<section>
					{hero}
					<section>
						{weapon}
						{heroPower}
					</section>
				</section>
				{tray}
			</div>
			{hand}
		</section>;

		let short = <section className="short">
			{deck}
			{field}
		</section>;

		let classNames = ['player'];

		if(this.props.isTop) {
			classNames.push('top');
		}

		if (this.props.choices) {
			classNames.push('inactive');
		}

		if (this.props.isCurrent && this.props.player.getTag(GameTag.MULLIGAN_STATE) == Mulligan.DONE) {
			classNames.push('current');
		}

		var gameresult = null;
		switch (this.props.player.getTag(GameTag.PLAYSTATE)) {
			case PlayState.WON:
				gameresult = <div className="gameresult">{this.props.player.getName()} wins!</div>;
				classNames.push('inactive-colored');
				break;
			case PlayState.LOST:
				classNames.push('inactive');
				break;
		}

		var action = null;
		if(this.props.descriptor) {
			let descriptor = this.props.descriptor;
			switch(this.props.descriptor.getType()) {
				case PowSubType.PLAY:
					let entity = null;
					// search for entity
					this.props.entities.forEach((map: Immutable.Map<number, Entity>) => {
						map.forEach((toCompare: Entity) => {
							if(descriptor.getEntity() === toCompare.getId()) {
								entity = toCompare;
							}
						});
					});
					if(entity !== null) {
						let type = entity.getTag(GameTag.CARDTYPE);
						let types = [CardType.WEAPON, CardType.SPELL, CardType.MINION];
						if(types.indexOf(type) != -1) {
							action = <div className="played"><Card
								entity={entity}
								option={null}
								optionCallback={null}
								assetDirectory={this.props.assetDirectory}
								cards={this.props.cards}
								isHidden={false}
								controller={this.props.player}
								cardArtDirectory={this.props.cardArtDirectory}
							/></div>;
						}
					}
					break;
			}
		}

		if (this.props.isTop) {
			return (
				<div className={classNames.join(' ')}>
					{gameresult}
					{choices}
					{action}
					{tall}
					{short}
				</div>
			);
		}
		else {
			return (
				<div className={classNames.join(' ')}>
					{gameresult}
					{choices}
					{action}
					{short}
					{tall}
				</div>
			);
		}
	}

	public shouldComponentUpdate(nextProps: PlayerProps, nextState) {
		return (
			this.props.player !== nextProps.player ||
			this.props.entities !== nextProps.entities ||
			this.props.options !== nextProps.options ||
			this.props.choices !== nextProps.choices ||
			this.props.optionCallback !== nextProps.optionCallback ||
			this.props.cardOracle !== nextProps.cardOracle ||
			this.props.cards !== nextProps.cards ||
			this.props.descriptor !== nextProps.descriptor ||
			this.props.isCurrent !== nextProps.isCurrent
		);
	}
}

export default Player;
