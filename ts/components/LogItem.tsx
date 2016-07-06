import * as React from "react";
import {CardDataProps, CardOracleProps, LogItemData, LineType, HideCardsProps} from "../interfaces";
import LogCard from "./LogCard";

interface LogItemProps extends CardDataProps, CardOracleProps, LogItemData, HideCardsProps, React.Props<any> {
	inactive: boolean;
	first?: boolean;
	isTopPlayer?: boolean;
}

class LogItem extends React.Component<LogItemProps, {}> {

	public shouldComponentUpdate(nextProps:LogItemProps) {
		return (
			(this.props.inactive !== nextProps.inactive ||
			this.props.cards !== nextProps.cards ||
			this.props.cardOracle !== nextProps.cardOracle) ||
			this.props.hideCards !== nextProps.hideCards ||
			this.props.isTopPlayer !== nextProps.isTopPlayer
		);
	}

	public render():JSX.Element {
		let characters = '';
		let classNames = ['line'];

		if (this.props.inactive) {
			classNames.push('inactive');
		}
		if(this.props.type == LineType.Turn) {
			classNames.push('header');
			if(!this.props.first) {
				characters += '\r\n';
			}
			characters += '# ';
		}
		else if(this.indent()) {
			classNames.push('indent');
			characters += '\t';
		}


		let hide = this.props.isTopPlayer && this.props.hideCards && [LineType.Draw, LineType.Get, LineType.GetToDeck].indexOf(this.props.type) !== -1;
		let knownEntityCardId = !hide && this.props.entity && this.props.entity.id;
		let entityCardId = hide ? knownEntityCardId : this.props.cardOracle.get(this.props.entityId);
		let entity = <LogCard key="entity" cards={this.props.cards} cardId={entityCardId} />;
		let knownTargetCardId = this.props.target && this.props.target.id;
		let targetCardId = (knownTargetCardId || this.props.hideCards) ? knownTargetCardId : this.props.cardOracle.get(this.props.targetId);
		let target= <LogCard key="target" cards={this.props.cards} cardId={targetCardId} />;

		let strings = {
			'player': this.props.player && this.props.player.getName(),
			'entity': entity,
			'target': target,
			'source': target,
			'data': this.props.data,
		} as any;

		var words = this.parseLine(strings).split(' ');
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

	private indent(): boolean {
		switch(this.props.type) {
			case LineType.Draw:
			case LineType.DiscardFromDeck:
			case LineType.Damage:
				return this.props.indent;
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

	private parseLine(strings: any): string {
		switch(this.props.type) {
			case LineType.Turn:
				return this.props.data == -1 ? "Mulligan" : "Turn %data%: %player%";
			case LineType.Win:
				return "%player% wins!";
			case LineType.Concede:
				return "%player% concedes";
			case LineType.Draw:
				return this.props.target ? "%player% draws %entity% from %source%" : "%player% draws %entity%";
			case LineType.Summon:
				return this.props.entity.type === 'WEAPON' ? "%source% creates %entity%" : "%source% summons %entity%";
			case LineType.Replace:
				return "%entity% replaces %target%";
			case LineType.ArmorBuff:
				return this.props.target ? "%entity% gains %data% armor from %source%" : "%entity% gains %data% armor";
			case LineType.AttackBuff:
				return this.props.target ? "%entity% gains +%data% attack from %source%" : "%entity% gains +%data% attack";
			case LineType.HealthBuff:
				return this.props.target ? "%entity% gains +%data% health" : "%entity% gains +%data% health from %source%";
			case LineType.AttackReduce:
				return "%source% sets %entity%'s attack to %data%";
			case LineType.HealthReduce:
				return "%source% sets %entity%'s health to %data%";
			case LineType.Attack:
				return this.props.data ? "%entity% attacks %target% for %data%" : "%entity% attacks %target%";
			case LineType.Death:
				return this.props.entity.type === 'WEAPON' ? "%entity% breaks" : "%entity% dies";
			case LineType.Discard:
				return "%player% discards %entity%";
			case LineType.DiscardFromDeck:
				return "%player% discards %entity% from their deck";
			case LineType.Get:
				return this.props.target ? "%player% receives %entity% from %source%" : "%player% receives %entity%";
			case LineType.GetToDeck:
				return this.props.target ? "%entity% from %source% is added to %player%'s deck" : "%entity% is added to %player%'s deck";
			case LineType.Trigger:
				return "%entity% triggers";
			case LineType.Damage:
				return this.props.data ? "%entity% damages %target% for %data%" : "%entity% hits %target%";
			case LineType.Healing:
				return "%entity% heals %target% for %data%";
			case LineType.Remove:
				return this.props.target ? "%source% removes %entity%" : "%entity% is removed";
			case LineType.Mulligan:
				return "%player% mulligans %entity%";
			case LineType.Silenced:
				return this.props.target ? "%entity% is silenced by %source%" : "%entity% is silenced";
			case LineType.Frozen:
				return this.props.data ? (this.props.target ? "%source% freezes %entity%" : "%entity% gets frozen") : "%entity% is no longer frozen";
			case LineType.Steal:
				return this.props.target ? "%player% steals %entity% using %source%" : "%player% steals %entity%";
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
				strings['status'] = this.getStatusKeyword();
				return this.props.data ? (this.props.target ? "%entity% gains %status% from %source%" : "%entity% gains %status%") : "%entity% loses %status%";
			case LineType.Cthun:
				strings['stats'] = this.props.data + '/' + this.props.data2;
				return "%entity% gets buffed to %stats%";
			case LineType.Play:
				const HERO_POWER = 'HERO_POWER';
				return this.props.target ? (this.props.entity && this.props.entity.type === HERO_POWER ? "%player% uses %entity% targeting %target%" : "%player% plays %entity% targeting %target%")
								  : this.props.entity && this.props.entity.type === HERO_POWER ? "%player% uses %entity%" : "%player% plays %entity%";
			case LineType.StatsBuff:
				strings['stats'] = '+' + this.props.data + '/+' + this.props.data2;
				return this.props.target ? "%entity% gains %stats% from %target%" : "%entity% gains %stats%";
		}
	}

	private getStatusKeyword(): string {
		switch (this.props.type) {
			case LineType.DivineShield: return 'Divine Shield';
			case LineType.Charge: return 'Charge';
			case LineType.Taunt: return 'Taunt';
			case LineType.Windfury: return 'Windfury';
			case LineType.Stealth: return 'Stealth';
			case LineType.CantBeDamaged: return 'Immunity';
		}
	}
}

export default LogItem;
