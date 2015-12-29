/// <reference path='../node_modules/immutable/dist/immutable.d.ts'/>
'use strict';

namespace Joust {
    export class GameState {
        private entities:Immutable.List<Entity>;
        private options:Immutable.List<Option>;

        constructor(entities?:Immutable.List<Entity>, options?:Immutable.List<Option>) {
            this.entities = entities || Immutable.List<Entity>();
            this.options = options || Immutable.List<Option>();
        }

        public addEntity(id:number, entity:Entity) : GameState {
            return new GameState(this.entities.set(id, entity), this.options);
        }

        public updateEntity(id:number, key:number, value:number) : GameState {
            var entities = this.entities;
            var entity = this.entities.get(id);
            var new_entity = entity.setTag(key, value);
            if(new_entity === entity) {
                return this;
            }
            return new GameState(this.entities.set(id, entity), this.options);
        }

        public getEntities() {
            return this.entities;
        }

        public getOptions() {
            return this.options;
        }

    }
}
