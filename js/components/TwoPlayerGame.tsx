/// <reference path="../../typings/react/react-global.d.ts" />
/// <reference path="../interfaces.d.ts" />
/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />
'use strict';

namespace Joust.Components {
    export class TwoPlayerGame extends React.Component<TwoPlayerGameProps, {}> {
        public render() {
            var player1 = this.props.player1;
            var player2 = this.props.player2;

            // returns a filter function for entity controller identity
            var filterByController = function (controller:number) {
                return function (entity:Entity):boolean {
                    return entity && entity.getController() === controller;
                };
            };

            // we lazily split up the player controlled entities
            var player1Entities = this.props.entities.filter(filterByController(player1.getId())).toSeq();
            var player2Entities = this.props.entities.filter(filterByController(player2.getId())).toSeq();

            return (
                <div>
                    <Player tags={player1.getTags()} entities={player1Entities}/>
                    <EndTurnButton />
                    <Player tags={player2.getTags()} entities={player2Entities}/>
                </div>
            );
        }
    }
}
