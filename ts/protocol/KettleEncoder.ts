import * as Stream from "stream";
import {InteractiveBackend} from "../interfaces";
import Option from "../Option";
import Entity from "../Entity";
import ClearOptionsMutator from "../state/mutators/ClearOptionsMutator";
import GameStateTracker from "../state/GameStateTracker";

class KettleEncoder extends Stream.Readable implements InteractiveBackend {

	private tracker: GameStateTracker;
	private gameStarted: boolean;

	constructor(tracker?: GameStateTracker, opts?: Stream.ReadableOptions) {
		opts = opts || {};
		opts.objectMode = true;
		super(opts);
		this.gameStarted = false;
		this.tracker = tracker;
	}

	public startGame(): void {
		var repeat = function(array: any[], times: number): any[] {
			var result = array;
			for (let i = 0; i < times; i++) {
				result = result.concat(array)
			}
			return result;
		};

		this.queueMessage([{
			Type: 'CreateGame',
			CreateGame: {
				Players: [
					{
						Name: 'Player 1',
						Hero: 'HERO_08',
						Cards: repeat(['GVG_003'], 30)
					},
					{
						Name: 'Player 2',
						Hero: 'HERO_08',
						Cards: repeat(['GVG_003'], 30)
					}
				]
			}
		}]);
	}

	public exitGame(): void {
		this.push(null);
	}

	public sendOption(option: Option, target?: number, position?: number): void {
		if (this.tracker) {
			this.tracker.write(new ClearOptionsMutator());
		}
		var sendOption = null;
		target = target || null;
		switch (option.getType()) {
			case 2: // end turn
				sendOption = { Index: option.getIndex() };
				break;
			case 3: // power
				sendOption = {
					Index: option.getIndex(),
					Target: target
				};
				if (typeof position === "number") {
					sendOption.Position = position;
				}
				console.log(sendOption);
				break;
		}
		this.queueMessage({
			Type: 'SendOption',
			SendOption: sendOption
		});
	}

	public chooseEntities(entities: Entity[]): void {
		var ids = entities.map(function(entity: Entity) {
			return entity.getId();
		});
		this.queueMessage({
			Type: 'ChooseEntities',
			ChooseEntities: ids
		})
	}

	_read(size: number): void {
		return;
	}

	protected queueMessage(payload) {
		var message = JSON.stringify(payload);
		var length = message.length;
		// todo: we need to properly encode the length (see onData)
		var buffer = new Buffer(function(number: number, length: number) {
			return Array(length - (number + '').length + 1).join('0') + number;
		} (length, 4) + message, 'utf-8');

		this.push(buffer.toString('utf-8'));
	}
}

export default KettleEncoder;
