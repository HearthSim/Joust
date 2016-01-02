'use strict';

import Player = require('../Player');
import Entity = require('../Entity');
import Option = require('../Option');
import AddEntityMutator = require('../state/mutators/AddEntityMutator');
import TagChangeMutator = require('../state/mutators/TagChangeMutator');
import ReplaceEntityMutator = require('../state/mutators/ReplaceEntityMutator');
import SetOptionsMutator = require('../state/mutators/SetOptionsMutator');
import GameStateTracker = require('../state/GameStateTracker');

class KettleParser {
	private socket;

	constructor(private tracker:GameStateTracker) {

	}

	public connect(port, host) {
		var Socket = require('net').Socket;
		var socket = new Socket();
		socket.setEncoding('utf-8');
		socket.connect(port, host);
		socket.once('connect', function () {
			console.debug('Connected to socket');
			this.createGame();
			this.socket.on('data', this.onData.bind(this));
			this.socket.once('close', function () {
				console.debug('Lost connection');
			});
		}.bind(this));
		this.socket = socket;
	}

	private handlePacket(packet) {
		var type = packet.Type;
		packet = packet[type];
		console.debug(type, ': ', packet);
		var mutator = null;
		switch (type) {
			case 'GameEntity':
			case 'FullEntity':
				var entity = new Entity(
					+packet.EntityID,
					Immutable.Map<number, number>(packet.Tags),
					packet.CardID || null
				);
				mutator = new AddEntityMutator(entity);
				break;
			case 'Player':
				var player = new Player(
					+packet.EntityID,
					Immutable.Map<number, number>(packet.Tags),
					+packet.PlayerID || +packet.EntityID, // default to EntityID until Kettle is changed
					packet.CardID || null,
					'PlayerName'
				);
				mutator = new AddEntityMutator(player);
				break;
			case 'TagChange':
				mutator = new TagChangeMutator(
					+packet.EntityID,
					+packet.Tag,
					+packet.Value
				);
				break;
			case 'Options':
				var options = Immutable.Map<number, Option>();
				options = options.withMutations(function (map) {
					packet.forEach(function(optionObject:any, index:number) {
						var option = new Option(
							index,
							optionObject.Type,
							optionObject.MainOption ? optionObject.MainOption.ID : null
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
			this.tracker.apply(mutator);
			this.tracker.mark(new Date().getTime());
		}
	}

	private onData(data:string) {
		var header = data.substr(0, 4);
		data = data.substr(4);
		var packets = JSON.parse(data);
		packets.forEach(this.handlePacket.bind(this));
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
						Name: 'BlackTea1',
						Cards: portals.toJS(),
						Hero: 'HERO_08'
					},
					{
						Name: 'BlackTea2',
						Cards: webspinners.toJS(),
						Hero: 'HERO_05'
					}
				]
			}
		}]);
	}

	public sendOption(option:Option) {
		this.sendPacket({
			Type: 'SendOption',
			SendOption: {
				Index: option.getIndex()
			}
		});
	}

	private sendPacket(packet) {
		var message = JSON.stringify(packet);
		return this.socket.write(this.pad(message.length, 4) + message);
	}

	private pad(number, length) {
		return Array(length - (number + '').length + 1).join('0') + number;
	}
}

export = KettleParser;