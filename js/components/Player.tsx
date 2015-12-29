/// <reference path="../../typings/react/react-global.d.ts" />
/// <reference path="../interfaces.d.ts" />
/// <reference path='../../node_modules/immutable/dist/immutable.d.ts'/>
'use strict';

namespace Joust.Components {
    export class Player extends React.Component<PlayerProps, {}> {
        public render() {
            var emptyTagList = Immutable.Map<number, number>();
            var heroTags = emptyTagList;
            var heroPowerTags = emptyTagList;
            var entities = [];
            this.props.entities.forEach(function (entity) {
                entities.push(<li key={entity.getId()}>#{entity.getId()}: {entity.getCardId()}</li>);
            });
            return (
                <div>
                    <h1>Player</h1>
                    <Hero tags={heroTags} />
                    <HeroPower tags={heroPowerTags} />
                    <h2>Entites</h2>
                    <ul>
                        {entities}
                    </ul>
                </div>
            );
        }
    }
}
