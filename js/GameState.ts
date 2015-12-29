/// <reference path='../node_modules/immutable/dist/immutable.d.ts'/>
'use strict';

namespace Joust {
    export class GameState {

        constructor(protected entities:Immutable.Map<number, Entity>,
                    protected entityTree:Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Entity>>>,
                    protected options:Immutable.Map<number, Option>) {
        }

        public getEntity(id:number) {
            return this.entities.get(id);
        }

        public getEntities():Immutable.Map<number, Entity> {
            return this.entities;
        }

        public getEntityTree():Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Entity>>> {
            return this.entityTree;
        }

        public getOptions():Immutable.Map<number, Option> {
            return this.options;
        }


        public addEntity(id:number, entity:Entity):GameState {
            if (this.entities.get(id)) {
                console.warn('Overwriting entity with id #' + id);
            }

            // add to global entity list
            var entities = this.entities.set(id, entity);

            // add to entity tree
            var entityTree = this.entityTree.setIn([entity.getController(), entity.getZone(), id], entity);

            // the game state always changes if we add a new entity
            return new GameState(entities, entityTree, this.options);
        }

        public updateEntity(id:number, key:number, value:number):GameState {
            // add to global entity list
            var oldEntity = this.getEntity(id);
            if (!oldEntity) {
                console.warn('Cannot update non-existant entity #' + id);
                return this;
            }

            // verify entity has actually changed
            var newEntity = oldEntity.setTag(key, value);
            if (newEntity === oldEntity) {
                console.warn('No tag change (tag ' + key + ' : ' + oldEntity.getTag(key) + ' -> ' + value +') on entity #' + id);
                return this;
            }

            // update global entity list
            var entities = this.entities.set(id, newEntity);

            // update entity tree
            var entityTree = this.entityTree.withMutations(function (map) {
                map.deleteIn([oldEntity.getController(), oldEntity.getZone(), id])
                    .setIn([newEntity.getController(), newEntity.getZone(), id], newEntity);
            });

            // the game state always changes if we add a new entity
            return new GameState(entities, entityTree, this.options);

        }
    }
}
