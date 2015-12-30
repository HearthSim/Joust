/// <reference path="../../typings/react/react-global.d.ts"/>
/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
/// <reference path="../../node_modules/immutable/dist/immutable.d.ts"/>
'use strict';

namespace Joust.Components {
	export class Joust extends React.Component<{}, JoustState> {
		private socket;

		public constructor(props) {
			super(props);
			this.state = {
				gameState: new GameState(
					Immutable.Map<number, Entity>(),
					Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Entity>>>(),
					Immutable.Map<number, Option>()
				)
			};
			this.socket = null;
		}

		private sendPacket(packet) {
			var message = JSON.stringify(packet);
			return this.socket.write(this.pad(message.length, 4) + message);
		}

		private pad(number, length) {
			return Array(length - (number + '').length + 1).join('0') + number;
		}

		private handlePacket(packet) {
			var type = packet.Type;
			packet = packet[type];
			console.debug(type, ': ', packet);
			switch (type) {
				case 'GameEntity':
				case 'Player':
				case 'FullEntity':
					var gs = this.state.gameState;
					var entity = new Entity(packet.EntityID, Immutable.Map<number, number>(packet.Tags), packet.CardID || null);
					var new_gs = gs.addEntity(entity);
					this.setState({gameState: new_gs});
					break;
				case 'TagChange':
					var gs = this.state.gameState;
					var new_gs = gs.tagChange(packet.EntityID, packet.Tag, packet.Value);
					this.setState({gameState: new_gs});
					break;
				case 'Options':
					//    this.setState({options: packet});
					break;
				default:
					console.log('Unknown packet type ' + type);
					break;
			}
		}

		private onData(data) {
			var header = data.substr(0, 4);
			data = data.substr(4);
			var packets = JSON.parse(data);
			packets.forEach(this.handlePacket.bind(this));
		}

		private onConnect() {
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
			this.socket.on('data', this.onData.bind(this));
			this.socket.once('close', function () {
				console.log('Socket closed');
			});
		}

		public componentDidMount() {
			var Socket = require('net').Socket;
			var socket = new Socket();
			this.socket = socket;
			socket.setEncoding('utf-8');
			socket.connect(9111, 'localhost');
			socket.once('connect', this.onConnect.bind(this));
		}

		public render() {
			var allEntities = this.state.gameState.getEntities();
			var entityTree = this.state.gameState.getEntityTree();

			var filterByCardType = function (cardType:number) {
				return function (entity:Entity):boolean {
					//if(entity) console.log(entity.getCardType());
					return !!entity && entity.getCardType() === cardType;
				};
			};

			// find the game entity
			var game = allEntities ? allEntities.filter(filterByCardType(1)).first() : null;
			if (!game) {
				return <p>Awaiting Game Entity.</p>;
			}

			// determine player count
			var players = allEntities.filter(filterByCardType(2));
			switch (players.count()) {
				case 0:
					return <p>Awaiting Player entities.</p>;
					break;
				case 2:
					return (
						<TwoPlayerGame entity={game} player1={players.first()} player2={players.last()}
									   entities={entityTree}/>
					);
					break;
				default:
					return <p>Unsupported player count: {players.size}.</p>;
			}
		}

		public shouldComponentUpdate(nextProps, nextState:JoustState) {
			return this.state.gameState !== nextState.gameState;
		}
	}

}
