/// <reference path="../../typings/node/node.d.ts"/>
import Iterable = Immutable.Iterable;
'use strict';

import Immutable = require('immutable');
import Player = require('../Player');
import Entity = require('../Entity');
import Option = require('../Option');
import AddEntityMutator = require('../state/mutators/AddEntityMutator');
import TagChangeMutator = require('../state/mutators/TagChangeMutator');
import ReplaceEntityMutator = require('../state/mutators/ReplaceEntityMutator');
import SetOptionsMutator = require('../state/mutators/SetOptionsMutator');
import {GameStateManager} from "../interfaces";
import {Socket} from 'net';

class KettleTranscoder {
	private socket;
	private buffer:Immutable.List<number>;

	constructor(private manager:GameStateManager) {
		this.buffer = Immutable.List<number>();
	}

	public connect(port, host) {
		var socket = new Socket();
		// we don't use set_encoding to parse the length
		socket.connect(port, host);
		socket.once('connect', function () {
			console.debug('Connected to socket');
			this.createGame();
			this.socket.on('data', this.onData.bind(this));
			this.socket.once('close', function () {
				this.manager.setComplete(true);
				console.debug('Lost connection');
			});
		}.bind(this));
		this.socket = socket;
	}

	public disconnect() {
		this.socket.close();
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
			default:
				console.log('Unknown packet type ' + type);
				break;
		}
		if (mutator) {
			this.manager.apply(mutator);
			this.manager.mark(new Date().getTime());
		}
	}

	private onData(buffer:Buffer) {
		this.buffer = this.buffer.withMutations(function(list) {
			for(var byte of buffer as any) { // this will call buffer.values() and iterate
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
			var decoded = new Buffer(temporary.toArray()).toString('utf-8');
			var packets = JSON.parse(decoded);
			packets.forEach(this.handlePacket.bind(this));
			this.buffer = temporary.slice(length).toList();
		}
	}

	private createGame() {
		var cardList = Immutable.List<String>(Array(30));
		var portals = cardList.map(function () {
			return 'GVG_003';
		});
		var webspinners = cardList.map(function () {
			return 'FP1_011';
		});
		this.sendPacket([{
			Type: 'CreateGame',
			CreateGame: {
				Players: [
					{
						Name: 'Player 1',
						Cards: portals.toJS(),
						Hero: 'HERO_05'
					},
					{
						Name: 'Player 2',
						Cards: webspinners.toJS(),
						Hero: 'HERO_05'
					}
				]
			}
		}]);
	}

	public sendOption(option:Option, target?:number) {
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
				break;
		}
		this.sendPacket({
			Type: 'SendOption',
			SendOption: sendOption
		});
	}

	private sendPacket(packet) {
		var message = JSON.stringify(packet);
		var length = message.length;
		// todo: we need to properly encode the length (see onData)
		return this.socket.write(this.pad(length, 4) + message);
	}

	private pad(number, length) {
		return Array(length - (number + '').length + 1).join('0') + number;
	}
}

export = KettleTranscoder;