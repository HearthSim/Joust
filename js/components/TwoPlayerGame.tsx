/// <reference path="../../typings/react/react-global.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
'use strict';

namespace Joust.Components {
	export class TwoPlayerGame extends React.Component<TwoPlayerGameProps, {}> {

		public render() {
			var entities = this.props.entities;
			var player1 = this.props.player1;
			var player2 = this.props.player2;

			var emptyEntities = Immutable.Map<number, Immutable.Map<number, Entity>>();
			return (
				<div>
					<Player player={player1} entities={entities.get(player1.getPlayerId()) || emptyEntities}/>
					<EndTurnButton/>
					<Player player={player2} entities={entities.get(player2.getPlayerId()) || emptyEntities}/>
				</div>
			);
		}

		public shouldComponentUpdate(nextProps:TwoPlayerGameProps, nextState) {
			return (
				this.props.entity !== nextProps.entity ||
				this.props.player1 !== nextProps.player1 ||
				this.props.player2 !== nextProps.player2 ||
				this.props.entities !== nextProps.entities
			);
		}
	}
}
