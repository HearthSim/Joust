/// <reference path="../../typings/react/react-global.d.ts"/>
/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
/// <reference path="../../node_modules/immutable/dist/immutable.d.ts"/>
'use strict';

namespace Joust.Components {
	export class Joust extends React.Component<{}, JoustState> {
		public constructor(props) {
			super(props);
			this.state = {
				gameState: new State.GameState(
					Immutable.Map<number, Entity>(),
					Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Entity>>>(),
					Immutable.Map<number, Option>()
				)
			};
		}

		private tracker;

		public componentDidMount() {
			var tracker = new State.GameStateTracker();
			tracker.on('update', this.updateState.bind(this));
			var hsreplay = new Protocol.HSReplayParser(tracker);
			this.tracker = tracker;
			hsreplay.parse('sample.xml');
		}

		public updateState() {
			this.setState({gameState: this.tracker.getGameState()});
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
