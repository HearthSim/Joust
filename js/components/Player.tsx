/// <reference path="../../typings/react/react-global.d.ts" />
/// <reference path="../interfaces.d.ts" />
/// <reference path='../../node_modules/immutable/dist/immutable.d.ts'/>
'use strict';

namespace Joust.Components {
    export class Player extends React.Component<PlayerProps, {}> {
        public render() {
            var hero = null;
            var heroPower = null;
            return (
                <div>
                    <h1>Player</h1>
                    <Hero entity={hero} />
                    <HeroPower entity={heroPower} />
                    <h2>Play</h2>
                    <EntityList entities={this.props.entities.get(1)} />
                    <h2>Deck</h2>
                    <EntityList entities={this.props.entities.get(2)} />
                    <h2>Hand</h2>
                    <EntityList entities={this.props.entities.get(3)} />
                    <h2>Secrets</h2>
                    <EntityList entities={this.props.entities.get(7)} />
                </div>
            );
        }

        public shouldComponentUpdate(nextProps:PlayerProps, nextState) {
            return (
                this.props.entity !== nextProps.entity ||
                this.props.entities !== nextProps.entities
            );
        }
    }
}
