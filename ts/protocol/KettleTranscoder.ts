/// <reference path="../../typings/node/node.d.ts"/>
import Iterable = Immutable.Iterable;

import * as Immutable from 'immutable';
import Player from '../Player';
import Entity from '../Entity';
import Option from '../Option';
import AddEntityMutator from '../state/mutators/AddEntityMutator';
import TagChangeMutator from '../state/mutators/TagChangeMutator';
import ReplaceEntityMutator from '../state/mutators/ReplaceEntityMutator';
import SetOptionsMutator from '../state/mutators/SetOptionsMutator';
import {GameStateManager} from "../interfaces";
import {Socket} from 'net';
import {Client} from "../interfaces";
import {ChoiceType} from "../enums";

class KettleTranscoder {
	private client:Client;
	private buffer:Immutable.List<number>;

	constructor(private manager:GameStateManager) {
		this.buffer = Immutable.List<number>();
	}

	public connect(client:Client) {
		this.client = client;
		this.client.on('data', this.onData.bind(this));
		this.manager.once('end', function () {
			client.disconnect();
		});
		this.client.connect();
	}

	public disconnect() {
		this.client.disconnect();
	}

	private handlePacket(packet) {
		var type = packet.Type;
		packet = packet[type];
		console.debug(type, ': ', packet);
		var mutator = null;
		switch (type) {
			case 'GameEntity':
			case 'FullEntity':
				var tags = {};
				Object.keys(packet.Tags).forEach(function (key) {
					tags['' + key] = packet.Tags[key];
				});
				var entity = new Entity(
					+packet.EntityID,
					Immutable.Map<string, number>(tags),
					packet.CardID || null
				);
				mutator = new AddEntityMutator(entity);
				break;
			case 'Player':
				var tags = {};
				Object.keys(packet.Tags).forEach(function (key) {
					tags['' + key] = packet.Tags[key];
				});
				var player = new Player(
					+packet.EntityID,
					Immutable.Map<string, number>(tags),
					+packet.PlayerID || +packet.EntityID, // default to EntityID until Kettle is changed
					packet.CardID || null,
					'PlayerName'
				);
				mutator = new AddEntityMutator(player);
				break;
			case 'TagChange':
				mutator = new TagChangeMutator(
					+packet.EntityID,
					'' + packet.Tag,
					+packet.Value
				);
				break;
			case 'Options':
				var options = Immutable.Map<number, Option>();
				options = options.withMutations(function (map) {
					packet.forEach(function (optionObject:any, index:number) {
						var option = new Option(
							index,
							optionObject.Type,
							optionObject.MainOption ? optionObject.MainOption.ID : null,
							optionObject.MainOption ? optionObject.MainOption.Targets : null
						);
						map = map.set(index, option);
					});
				});
				mutator = new SetOptionsMutator(options);
				break;
			case 'EntityChoices':
				var entities = packet.Entities;
				switch(packet.Type) {
					case ChoiceType.GENERAL:
						console.log('Choose between the following entities: ' + entities);
						break;
					default:
						console.error("Unknown choice type "+packet.Type);
						break;
				}
				break;
			default:
				console.log('Unknown packet type ' + type);
				break;
		}
		if (mutator) {
			this.manager.apply(mutator);
			this.manager.mark(new Date().getTime());
		}
	}

	public onData(buffer:Buffer) {
		this.buffer = this.buffer.withMutations(function (list) {
			for (var byte of buffer as any) { // this will call buffer.values() and iterate
				list = list.push(byte);
			}
		});
		this.drainBuffer();
	}

	private drainBuffer() {
		while (this.buffer.count() > 0) {
			if (this.buffer.count() < 4) {
				return;
			}
			// parse length
			var lengthBytes = [];
			var temporary = this.buffer;
			for (var i = 0; i < 4; i++) {
				lengthBytes[i] = temporary.first();
				temporary = temporary.shift();
			}
			var length = new Buffer(lengthBytes).readInt32LE(0);
			if (temporary.count() < length) {
				// wait for more data
				return;
			}
			// decode data and shift buffer
			var decoded = new Buffer(temporary.slice(0, length).toArray()).toString('utf-8');
			var packets = JSON.parse(decoded);
			packets.forEach(this.handlePacket.bind(this));
			this.buffer = temporary.slice(length).toList();
		}
	}

	public createGame(player1:string, hero1:string, deck1:string[],
					  player2:string, hero2:string, deck2:string[]) {
		this.sendPacket([{
			Type: 'CreateGame',
			CreateGame: {
				Players: [
					{
						Name: player1,
						Hero: hero1,
						Cards: deck1
					},
					{
						Name: player2,
						Hero: hero2,
						Cards: deck2
					}
				]
			}
		}]);
	}

	public sendOption(option:Option, target?:number, position?:number):void {
		var sendOption = null;
		target = target || null;
		switch (option.getType()) {
			case 2: // end turn
				sendOption = {Index: option.getIndex()};
				break;
			case 3: // power
				sendOption = {
					Index: option.getIndex(),
					Target: target
				};
				if(typeof position === "number") {
					sendOption.Position = position;
				}
				console.log(sendOption);
				break;
		}
		this.sendPacket({
			Type: 'SendOption',
			SendOption: sendOption
		});
	}

	public chooseEntitites(entities:Entity[]):void {
		var ids = entities.map(function(entity:Entity) {
			return entity.getId();
		});
		this.sendPacket({
			Type: 'ChooseEntities',
			ChooseEntities: ids
		})
	}

	private sendPacket(packet) {
		var message = JSON.stringify(packet);
		var length = message.length;
		// todo: we need to properly encode the length (see onData)
		var buffer = new Buffer(this.pad(length, 4) + message, 'utf-8');
		return this.client.write(buffer);
	}

	private pad(number, length) {
		return Array(length - (number + '').length + 1).join('0') + number;
	}
}

export default KettleTranscoder;