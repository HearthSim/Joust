/// <reference path="../../typings/react/react-global.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
'use strict';

namespace Joust.Components {
	export class TwoPlayerGame extends React.Component<TwoPlayerGameProps, {}> {

		public render() {
			var entities = this.props.entities;
			var player1 = this.props.player1;
			var player2 = this.props.player2;

			return (
				<div>
					<Player entity={player1} entities={entities.get(player1.getId())}/>
					<EndTurnButton/>
					<Player entity={player2} entities={entities.get(player2.getId())}/>
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
