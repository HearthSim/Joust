import * as Stream from "stream";
import Entity from "../Entity";
import AddEntityMutator from "../state/mutators/AddEntityMutator";
import Player from "../Player";
import TagChangeMutator from "../state/mutators/TagChangeMutator";
import Option from "../Option";
import SetOptionsMutator from "../state/mutators/SetOptionsMutator";
import {ChoiceType} from "../enums";
import * as Immutable from "immutable"

class KettleDecoder extends Stream.Transform {

	private buffer:Immutable.List<number>;
	private ready;
	private draining;

	constructor(opts?:Stream.TransformOptions) {
		opts = opts || {};
		opts.objectMode = true;
		super(opts);
		this.buffer = Immutable.List<number>();
		this.ready = false;
		this.draining = false;
	}

	_write(chunk:number[], encoding:string, callback:Function):void {
		// fill the buffer with any incoming message
		this.buffer = this.buffer.withMutations(function (list) {
			for (let i = 0; i < chunk.length; i++) { // this will call buffer.values() and iterate
				let byte = chunk[i];
				list = list.push(byte);
			}
		});
		if (this.ready) {
			this.drainBuffer();
		}
		callback();
	}

	private drainBuffer() {
		if (this.draining) {
			return;
		}
		this.draining = true;
		// attempt to drain the buffer
		while (this.buffer.count() > 0) {
			if (this.buffer.count() < 4) {
				return;
			}
			// parse length
			var lengthBytes = [];
			var temporary = this.buffer;
			for (let i = 0; i < 4; i++) {
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
		this.draining = false;
	}

	_read(size:number):void {
		this.ready = true;
		this.drainBuffer();
	}

	private handlePacket(packet) {
		var type = packet.Type;
		packet = packet[type];
		console.debug(type+ ':', packet);
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
					+packet.Tag,
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
				switch (packet.Type) {
					case ChoiceType.GENERAL:
						console.log('Choose between the following entities: ' + entities);
						break;
					default:
						console.error("Unknown choice type " + packet.Type);
						break;
				}
				break;
			case 'ActionEnd':
			case 'ActionStart':
				// @todo actions
				break;
			default:
				console.log('Unknown packet type ' + type);
				break;
		}
		if (mutator) {
			mutator.time = new Date().getTime();
			if (!this.push(mutator)) {
				this.ready = false;
			}
		}
	}
}

export default KettleDecoder;