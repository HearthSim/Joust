import * as React from "react";
import * as _ from "lodash";
import { CardDataProps, CardOracleProps, CardData, LogItemData,	LineType } from "../interfaces";

interface LogItemProps extends CardDataProps, CardOracleProps, React.Props<any> {
	lid: LogItemData;
	inactive: boolean;
	first?: boolean;
}

class LogItem extends React.Component<LogItemProps, {}> {

	public shouldComponentUpdate(nextProps:LogItemProps) {
		return (
			(this.props.inactive !== nextProps.inactive ||
			!_.isEqual(this.props.lid, nextProps.lid) ||
			this.props.cards !== nextProps.cards ||
			this.props.cardOracle !== nextProps.cardOracle)
		);
	}

	public render():JSX.Element {
		let lid = this.props.lid;
		let characters = '';
		let classNames = ['line'];

		if (this.props.inactive) {
			classNames.push('inactive');
		}
		if(lid.type == LineType.Turn) {
			classNames.push('header');
			if(!this.props.first) {
				characters += '\r\n';
			}
			characters += '# ';
		}
		else if(this.indent(lid)) {
			classNames.push('indent');
			characters += '\t';
		}

		if (!lid.entity) {
			let cardId = this.props.cardOracle.get(lid.entityId);
			lid.entity = this.props.cards.get(cardId);
		}
		if (!lid.target) {
			let cardId = this.props.cardOracle.get(lid.targetId);
			lid.target = this.props.cards.get(cardId);
		}
		let entity = lid.entity ?
			<div key="entity" className={this.getRarityClass(lid.entity)}>[{lid.entity.name}]</div> : ' a card';
		let target = lid.target ?
			<div key="target" className={this.getRarityClass(lid.target)}>[{lid.target.name}]</div> : ' a card';

		let strings = {
			'player': lid.player,
			'entity': entity,
			'target': target,
			'source': target,
			'data': lid.data,
		} as any;

		var words = this.parseLine(lid, strings).split(' ');
		var parts = words.map((word) => {
			let parts = word.match(/^(.*)%(\w+)%(.*)$/);
			if(parts === null) {
				return word;
			}
			let key = parts[2];
			if(strings[key]) {
				if(typeof strings[key] !== 'object') {
					return parts[1] + strings[key] + parts[3];
				}
				else {
					return strings[key];
				}
			}
		}).map((word, i) => typeof word !== 'object' ? (i > 0 ? ' ' : '') + word + ' ' : word);

		return (
			<div className={classNames.join(' ')}>
				{characters ? <pre>{characters}</pre> : null}{parts}
			</div>
		);
	}

	private indent(lid: LogItemData): boolean {
		switch(lid.type) {
			case LineType.Draw:
			case LineType.DiscardFromDeck:
			case LineType.Damage:
				return lid.indent;
			case LineType.Turn:
			case LineType.Play:
			case LineType.Attack:
			case LineType.Concede:
			case LineType.Win:
			case LineType.TurnEnd:
			case LineType.Mulligan:
				return false;
		}
		return true;
	}

	private parseLine(lid: LogItemData, strings: any): string {
		switch(lid.type) {
			case LineType.Turn:
				return lid.data == -1 ? "Mulligan" : "Turn %data%: %player%";
			case LineType.Win:
				return "%player% wins!";
			case LineType.Concede:
				return "%player% concedes";
			case LineType.Draw:
				return lid.target ? "%player% draws %entity% from %source%" : "%player% draws %entity%";
			case LineType.Summon:
				return lid.entity.type === 'WEAPON' ? "%source% creates %entity%" : "%source% summons %entity%";
			case LineType.Replace:
				return "%entity% replaces %target%";
			case LineType.ArmorBuff:
				return lid.target ? "%entity% gains %data% armor from %source%" : "%entity% gains %data% armor";
			case LineType.AttackBuff:
				return lid.target ? "%entity% gains +%data% attack from %source%" : "%entity% gains +%data% attack";
			case LineType.HealthBuff:
				return lid.target ? "%entity% gains +%data% health" : "%entity% gains +%data% health from %source%";
			case LineType.AttackReduce:
				return "%source% sets %entity%'s attack to %data%";
			case LineType.HealthReduce:
				return "%source% sets %entity%'s health to %data%";
			case LineType.Attack:
				return lid.data ? "%entity% attacks %target% for %data%" : "%entity% attacks %target%";
			case LineType.Death:
				return lid.entity.type === 'WEAPON' ? "%entity% breaks" : "%entity% dies";
			case LineType.Discard:
				return "%player% discards %entity%";
			case LineType.DiscardFromDeck:
				return "%player% discards %entity% from their deck";
			case LineType.Get:
				return lid.target ? "%player% receives %entity% from %source%" : "%player% receives %entity%";
			case LineType.GetToDeck:
				return lid.target ? "%entity% from %source% is added to %player%'s deck" : "%entity% is added to %player%'s deck";
			case LineType.Trigger:
				return "%entity% triggers";
			case LineType.Damage:
				return lid.data ? "%entity% damages %target% for %data%" : "%entity% hits %target%";
			case LineType.Healing:
				return "%entity% heals %target% for %data%";
			case LineType.Remove:
				return lid.target ? "%source% removes %entity%" : "%entity% is removed";
			case LineType.Mulligan:
				return "%player% mulligans %entity%";
			case LineType.Silenced:
				return lid.target ? "%entity% is silenced by %source%" : "%entity% is silenced";
			case LineType.Frozen:
				return lid.data ? (lid.target ? "%source% freezes %entity%" : "%entity% gets frozen") : "%entity% is no longer frozen";
			case LineType.Steal:
				return lid.target ? "%player% steals %entity% using %source%" : "%player% steals %entity%";
			case LineType.DeckToPlay:
				return "%source% brings %entity% into play";
			case LineType.PlayToDeck:
				return "%source% returns %entity% to %player%'s deck";
			case LineType.PlayToHand:
				return "%source% returns %entity% to %player%'s hand";
			case LineType.Weapon:
				return "%entity% equips %target%";
			case LineType.TurnEnd:
				return "%player% ends their turn";
			case LineType.DivineShield:
			case LineType.Charge:
			case LineType.Taunt:
			case LineType.Windfury:
			case LineType.Stealth:
			case LineType.CantBeDamaged:
				strings['status'] = this.getStatusKeyword(lid.type);
				return lid.data ? (lid.target ? "%entity% gains %status% from %source%" : "%entity% gains %status%") : "%entity% loses %status%";
			case LineType.Cthun:
				strings['stats'] = lid.data + '/' + lid.data2;
				return "%entity% gets buffed to %stats%";
			case LineType.Play:
				const HERO_POWER = 'HERO_POWER';
				return lid.target ? (lid.entity.type === HERO_POWER ? "%player% uses %entity% targeting %target%" : "%player% plays %entity% targeting %target%")
								  : lid.entity.type === HERO_POWER ? "%player% uses %entity%" : "%player% plays %entity%";
			case LineType.StatsBuff:
				strings['stats'] = '+' + lid.data + '/+' + lid.data2;
				return lid.target ? "%entity% gains %stats% from %target%" : "%entity% gains %stats%";
		}
	}

	private getStatusKeyword(type: LineType): string {
		switch (type) {
			case LineType.DivineShield: return 'Divine Shield';
			case LineType.Charge: return 'Charge';
			case LineType.Taunt: return 'Taunt';
			case LineType.Windfury: return 'Windfury';
			case LineType.Stealth: return 'Stealth';
			case LineType.CantBeDamaged: return 'Immunity';
		}
	}

	private getRarityClass(card:CardData):string {
		if (card) {
			if (card.type == "HERO" || card.type == "HERO_POWER") {
				return 'entity special';
			}
			if (card.rarity) {
				return 'entity ' + card.rarity.toString().toLowerCase();
			}
		}
		return 'entity';
	}
}

export default LogItem;
