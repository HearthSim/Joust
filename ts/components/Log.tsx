import * as React from "react";
import GameState from "../state/GameState";
import LogItem from "./LogItem";
import {
	CardDataProps, CardOracleProps, GameStateDiff, HistoryEntry, LogItemData, LineType, CardData,
	HideCardsProps
} from "../interfaces";
import {Zone, CardType, GameTag, BlockType, MetaDataType, Mulligan, PlayState, Step} from "../enums";
import Player from "../Player";
import Entity from "../Entity";

interface LogProps extends CardDataProps, CardOracleProps, HideCardsProps, React.Props<any> {
	state:GameState;
	tail:HistoryEntry;
	currentTime: number;
}

interface LogState {
	lines:LogItemData[];
}

class Log extends React.Component<LogProps, LogState> {

	constructor(props:LogProps) {
		super(props);
		this.state = {
			lines: []
		};
	}

	public shouldComponentUpdate(nextProps:LogProps, nextState:LogState) {
		return (
			(this.props.tail && this.props.tail.state !== nextProps.tail.state) ||
			this.props.currentTime !== nextProps.currentTime ||
			this.props.cards !== nextProps.cards ||
			this.props.cardOracle !== nextProps.cardOracle ||
			this.props.hideCards !== nextProps.hideCards
		);
	}

	public componentWillReceiveProps(nextProps:LogProps) {
		if (this.props.tail !== nextProps.tail) {
			let lines = [];
			let next, current = nextProps.tail;
			if (current) {
				lines.push({type: LineType.Turn, data: -1, time: current.state.getTime()});
				while (next = current.next) {
					this.analyzeGameStateDiff(current.state, next.state).forEach(d => lines.push(d));
					current = next;
				}
			}
			this.setState({lines: this.simplify(lines)});
		}
	}

	private simplify(input: LogItemData[]): LogItemData[] {
		let output = [];
		for (let i = 0; i < input.length - 1; i++) {
			let curr = input[i];
			let next = input[i+1];
			if (curr.targetId == next.targetId) {
				if (curr.type == LineType.Summon && next.type == LineType.Remove || curr.type == LineType.Remove && next.type == LineType.Summon) {
					let entity = curr.type == LineType.Summon ? curr : next;
					let target = curr.type == LineType.Remove ? curr : next;
					output.push({
						type: LineType.Replace, time: curr.time, indent: next.indent,
						entity: entity.entity, entityId: entity.entityId,
						target: target.entity, targetId: target.entityId
					});
					i++;
				}
				else if(curr.entityId == next.entityId && (curr.type == LineType.AttackBuff && next.type == LineType.HealthBuff
						|| curr.type == LineType.HealthBuff && next.type == LineType.AttackBuff)) {
					output.push({
						type: LineType.StatsBuff, time: curr.time, entity: curr.entity, entityId: curr.entityId,
						target: curr.target, targetId: curr.targetId, indent: next.indent,
						data: curr.type == LineType.AttackBuff ? curr.data : next.data,
						data2: curr.type == LineType.AttackBuff ? next.data : curr.data
					});
					i++;
				}
				else {
					output.push(curr);
				}
			}
			else if (curr.type == LineType.TurnEnd && next.type == LineType.Turn) {
				//skip TurnEnd message
			}
			else {
				output.push(curr);
			}
		}
		output.push(input[input.length-1]);
		return output;
	}

	public render():JSX.Element {
		let activeLines = this.state.lines.filter(lid => lid.time <= this.props.currentTime).length;
		let offset = Math.max(0, activeLines - 20);
		let lines = this.state.lines.slice(offset).map((lid, index) =>
			<LogItem key={index + offset}
					 first={!index}
					 type={lid.type}
					 entity={lid.entity}
					 entityId={lid.entityId}
					 target={lid.target}
					 targetId={lid.targetId}
					 player={lid.player}
					 data={lid.data}
					 data2={lid.data2}
					 indent={lid.indent}
					 inactive={lid.time >= this.props.currentTime}
					 cardOracle={this.props.cardOracle}
					 cards={this.props.cards}
					 hideCards={this.props.hideCards}/>);

		return <div className="joust-log">{lines}</div>;
	}

	private analyzeGameStateDiff(prev:GameState, curr:GameState):LogItemData[] {
		let data = [];
		let turn = this.getTurn(prev, curr);
		if (turn) {
			return [turn];
		}
		this.analyzeDescriptors(prev, curr).forEach(x => data.push(x));
		if (!curr.getDiffs().isEmpty()) {
			this.analyzeDiffs(curr).forEach(x => data.push(x));
		}
		return data;
	}

	private getTurn(prev:GameState, curr:GameState):LogItemData {
		let lid = this.newLogItemData(curr);
		let cGame = curr.getEntity(1);
		let pGame = prev.getEntity(1);
		if (cGame.getTag(GameTag.TURN) > pGame.getTag(GameTag.TURN)
			|| !prev.getPlayers().every(x => x.getTag(GameTag.MULLIGAN_STATE) == Mulligan.DONE)
			&& curr.getPlayers().every(x => x.getTag(GameTag.MULLIGAN_STATE) == Mulligan.DONE)) {
			lid.type = LineType.Turn;
			lid.data = Math.floor((cGame.getTag(GameTag.TURN) + 1 ) / 2);
			this.setLidPlayer(lid, curr, p => p.getTag(GameTag.CURRENT_PLAYER) == 1);
		}
		if (lid.type) {
			return lid;
		}
		return null;
	}

	private analyzeDescriptors(prev:GameState, curr:GameState):LogItemData[] {
		let lid = this.newLogItemData(curr);
		let lidStack = [];

		let push = (type:LineType) => {
			lid.type = type;
			lidStack.push(lid);
			lid = this.newLogItemData(curr, lid.entity, lid.entityId);
		};

		curr.getDescriptors().filterNot(d => prev.getDescriptors().contains(d)).forEach(d => {
			let entity = curr.getEntity(d.getEntity());
			lid.entity = this.getCardData(curr, d.getEntity());
			lid.entityId = d.getEntity();
			lid.target = this.getCardData(curr, d.getTarget());
			lid.targetId = d.getTarget();
			let type = d.getType();
			if (type == BlockType.ATTACK) {
				let metaDamage = d.getMetaData().find(x => x.getType() == MetaDataType.DAMAGE);
				lid.data = metaDamage && metaDamage.getData();
				push(LineType.Attack);
			}
			else if ((type == BlockType.POWER || type == BlockType.TRIGGER) && lid.entity) {
				if (d.getType() == BlockType.TRIGGER && entity.getTag(GameTag.SECRET)) {
					push(LineType.Trigger);
				}
				let damages = new Map();
				let heals = new Map();
				d.getMetaData().forEach(x => {
					let metaType = x.getType();
					if (metaType == MetaDataType.DAMAGE || metaType == MetaDataType.HEALING) {
						x.getEntities().forEach(e => {
							let map = metaType == MetaDataType.DAMAGE ? damages : heals;
							map.set(e, x.getData() + (map.get(e) || 0));
						});
					}
				});
				damages.forEach((value, id) => {
					this.setLidTarget(lid, curr, id);
					lid.data = value;
					push(LineType.Damage);
				});
				heals.forEach((value, id) => {
					this.setLidTarget(lid, curr, id);
					lid.data = value;
					push(LineType.Healing);
				});
			}
			else if (type == BlockType.PLAY) {
				this.setLidPlayer(lid, curr, p => p.getPlayerId() == entity.getController());
				push(LineType.Play);
			}
		});
		return lidStack;
	}

	private analyzeDiffs(state:GameState):LogItemData[] {
		let lid = this.newLogItemData(state);
		let lidStack = [];
		let cthunBuff = 0;

		let push = (type:LineType) => {
			if (type) {
				lid.type = type;
				lidStack.push(lid);
				lid = this.newLogItemData(state);
			}
		};

		state.getDiffs().forEach((diff:GameStateDiff) => {
			let entity = state.getEntity(diff.entity);
			let descriptor = state.getDescriptor();

			this.setLidEntity(lid, state, diff.entity);
			this.setLidTarget(lid, state, descriptor && descriptor.getEntity());
			this.setLidPlayer(lid, state, p => p.getPlayerId() == entity.getController());

			if (diff.tag == GameTag.ZONE) {
				if (diff.previous == Zone.DECK && diff.current == Zone.HAND && lid.target
					&& state.getEntity(lid.targetId).getZone() == Zone.GRAVEYARD) {
					lid.indent = true;
				}
				push(this.getZoneChangeLine(diff, entity.getCardType()));

			}
			else if (diff.previous !== null) {
				lid.data = diff.current;
				if (entity.getZone() == Zone.PLAY) {
					push(this.getInPlayLine(diff, state, entity, lid));
				}
				push(this.getLine(diff));
				if (diff.tag == GameTag.ATK && entity && lid.target && diff.previous < diff.current) {
					cthunBuff |= +(entity.getCardId() == 'OG_279');
				}
				else if (diff.tag == GameTag.HEALTH && entity && diff.previous < diff.current) {
					cthunBuff |= +(entity.getCardId() == 'OG_279') << 1;
				}
			}
		});
		if (cthunBuff == 3) {
			let cthunProxy = state.getEntities().find(x => x.getCardId() == 'OG_279');
			lid.entity = this.props.cards.get('OG_279');
			lid.data = cthunProxy.getAtk();
			lid.data2 = cthunProxy.getHealth();
			push(LineType.Cthun);
		}
		return lidStack;
	}

	private getLine(diff: GameStateDiff): LineType {
		switch (diff.tag) {
			case GameTag.CONTROLLER:
				return LineType.Steal;
			case GameTag.PLAYSTATE:
				switch (diff.current) {
					case PlayState.CONCEDED:
						return LineType.Concede;
					case PlayState.WON:
						return LineType.Win;
				}
		}
		return null;
	}

	private getInPlayLine(diff: GameStateDiff, state: GameState, entity: Entity, lid: LogItemData): LineType {
		switch (diff.tag) {
			case GameTag.ATK:
				if (entity && lid.target) {
					if (diff.previous < diff.current) {
						lid.data = diff.current - diff.previous;
						return LineType.AttackBuff;
					}
					else if (diff.previous > diff.current) {
						lid.data = diff.current;
						return LineType.AttackReduce;
					}
				}
				break;
			case GameTag.HEALTH:
				if (entity) {
					if (diff.previous < diff.current) {
						lid.data = diff.current - diff.previous;
						return LineType.HealthBuff;
					}
					else if (diff.previous > diff.current) {
						lid.data = diff.current;
						return LineType.HealthReduce;
					}
				}
				break;
			case GameTag.ARMOR:
				if (diff.previous < diff.current) {
					lid.data = diff.current - diff.previous;
					return LineType.ArmorBuff;
				}
				break;
			case GameTag.DIVINE_SHIELD:
				return LineType.DivineShield;
			case GameTag.TAUNT:
				return LineType.Taunt;
			case GameTag.STEALTH:
				return LineType.Stealth;
			case GameTag.FROZEN:
				return LineType.Frozen;
			case GameTag.CHARGE:
				return LineType.Charge;
			case GameTag.SILENCED:
				return LineType.Silenced;
			case GameTag.WINDFURY:
				return LineType.Windfury;
			case GameTag.CANT_BE_DAMAGED:
				return LineType.CantBeDamaged;
			case GameTag.WEAPON:
				if (diff.current) {
					let entity = state.getEntity(lid.entityId);
					this.setLidEntity(lid, state, entity && entity.getTag(GameTag.HERO_ENTITY));
					this.setLidTarget(lid, state, diff.current);
					return LineType.Weapon;
				}
				return null;
			case GameTag.NEXT_STEP:
				if (diff.current == Step.MAIN_CLEANUP) {
					this.setLidPlayer(lid, state, p => p.getTag(GameTag.CURRENT_PLAYER) == 1);
					return LineType.TurnEnd;
				}
				return null;
		}
		return null;
	}

	private getZoneChangeLine(diff: GameStateDiff, cardType: CardType): LineType {
		switch (diff.previous) {
			case Zone.PLAY:
				switch (diff.current) {
					case Zone.DECK:
						return LineType.PlayToDeck;
					case Zone.HAND:
						return LineType.PlayToHand;
					case Zone.GRAVEYARD:
						return [CardType.MINION, CardType.HERO, CardType.WEAPON].indexOf(cardType) !== -1 && LineType.Death;
					case Zone.SETASIDE:
						return [CardType.MINION, CardType.HERO, CardType.HERO_POWER].indexOf(cardType) !== -1 && LineType.Remove;
				}
				break;
			case Zone.DECK:
				switch (diff.current) {
					case Zone.HAND:
						return LineType.Draw;
					case Zone.GRAVEYARD:
					case Zone.REMOVEDFROMGAME:
					case Zone.SETASIDE:
						return LineType.DiscardFromDeck;
					case Zone.PLAY:
						return LineType.DeckToPlay;
				}
				break;
			case Zone.HAND:
				switch (diff.current) {
					case Zone.DECK:
						return LineType.Mulligan;
					case Zone.GRAVEYARD:
					case Zone.REMOVEDFROMGAME:
					case Zone.SETASIDE:
						return LineType.Discard;
				}
				break;
			case Zone.SETASIDE:
				switch(diff.current) {
					case Zone.HAND:
						return LineType.Get;
					case Zone.PLAY:
						return [CardType.MINION, CardType.HERO, CardType.HERO_POWER].indexOf(cardType) !== -1 && LineType.Summon;
				}
				break;
			case null:
			case Zone.INVALID:
				switch (diff.current) {
					case Zone.DECK:
						return LineType.GetToDeck;
					case Zone.HAND:
						return LineType.Get;
					case Zone.PLAY:
						return [CardType.MINION, CardType.HERO, CardType.HERO_POWER, CardType.WEAPON].indexOf(cardType) !== -1 && LineType.Summon;
				}
				break;
		}
		return null;
	}

	private getCardData(state: GameState, id: number) {
		let entity = state.getEntity(id);
		return this.props.cards.get(entity && entity.getCardId() || this.props.cardOracle.get(id));
	}

	private setLidEntity(lid: LogItemData, state: GameState, id: number) {
		if (id) {
			lid.entityId = id;
			lid.entity = this.getCardData(state, id);
		}
	}

	private setLidTarget(lid: LogItemData, state: GameState, id: number) {
		if (id) {
			lid.targetId = id;
			lid.target = this.getCardData(state, id);
		}
	}

	private setLidPlayer(lid: LogItemData, state: GameState, predicate: (player: Player) => boolean) {
		let player = state.getPlayers().find(p => predicate(p));
		lid.player = player && player.getName();
	}

	private newLogItemData(state: GameState, entity?: CardData, entityId?: number): LogItemData {
		return {type: 0, data: 0, time: state.getTime(), entity: entity, entityId: entityId,
			indent: state.getDescriptors().count() > 1 || state.getEntity(1).getTag(GameTag.NEXT_STEP) == Step.MAIN_CLEANUP} as LogItemData;
	}
}

export default Log;
