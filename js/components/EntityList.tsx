/// <reference path="../../typings/react/react-global.d.ts" />
/// <reference path="../interfaces.d.ts" />
/// <reference path='../../node_modules/immutable/dist/immutable.d.ts'/>
'use strict';

namespace Joust.Components {
    export class EntityList extends React.Component<EntityListProps, {}> {
        public render() {
            var entities = [];
            if (this.props.entities) {
                this.props.entities.forEach(function (entity) {
                    var id = entity.getCardId() ? (' (CardID=' + entity.getCardId() + ')') : '';
                    entities.push(<li key={entity.getId()}>Entity #{entity.getId()}{id}</li>);
                });
            }
            return (
                <ul>
                    {entities}
                </ul>
            );
        }

        public shouldComponentUpdate(nextProps:EntityListProps, nextState) {
            return (
                this.props.entities !== nextProps.entities
            );
        }
    }
}
