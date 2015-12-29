/// <reference path="../../typings/react/react-global.d.ts" />
/// <reference path="../interfaces.d.ts" />
/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />
'use strict';

namespace Joust.Components {
    export class TwoPlayerGame extends React.Component<GameProps, {}> {
        public render() {
            var entities = this.props.entities;

            var emptyTags = Immutable.Map<number, number>();
            var player1Tags = emptyTags;
            var player2Tags = emptyTags;

            // returns a filter function for entity controller identity
            var filterByController = function (controller:number) {
                return function (entity:Entity):boolean {
                    return entity && entity.getController() === controller;
                };
            };

            // we lazily split up the player controlled entities
            var player1Entities = this.props.entities.filter(filterByController(2)).toSeq();
            var player2Entities = this.props.entities.filter(filterByController(3)).toSeq();

            return (
                <div>
                    <Player tags={player1Tags} entities={player1Entities}/>
                    <EndTurnButton />
                    <Player tags={player2Tags} entities={player2Entities}/>
                </div>
            );
        }
    }
}
