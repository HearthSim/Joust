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

		public addEntity(entity:Entity):GameState {
			var id = entity && entity.getId() || 0;
			if (id < 1) {
				console.error('Cannot add entity: Invalid entity id');
				return this;
			}

			if (this.entities.get(id)) {
				console.warn('Overwriting entity with id #' + id);
				// we might have a stale entity at the old location in the entity tree
			}

			// add to global entity list
			var entities = this.entities.set(id, entity);

			// add to entity tree
			var entityTree = this.entityTree.setIn([entity.getController(), entity.getZone(), id], entity);

			// the game state always changes if we add a new entity
			return new GameState(entities, entityTree, this.options);
		}

		public showEntity(id:number, cardId:string, tags:number[][]):GameState {
			var oldEntity = this.getEntity(id);
			if (!oldEntity) {
				console.error('Cannot show non-existent entity #' + id);
				return this;
			}

			// we're allocating two entities here. Maybe we do .withMutations() at some point?
			var newEntity = oldEntity.setCardId(cardId).setTags();
			return this.updateEntity(newEntity);
		}

		public hideEntity(id:number, zone:number):GameState {
			return this;
		}

		public tagChange(id:number, tag:number, value:number):GameState {
			var oldEntity = this.getEntity(id);
			if (!oldEntity) {
				console.error('Cannot change tag on non-existent entity #' + id);
				return this;
			}

			var newEntity = oldEntity.setTag(tag, value);
			if (newEntity === oldEntity) {
				console.warn('No tag change (tag ' + tag + ' : ' + oldEntity.getTag(tag) + ' -> ' + value + ') on entity #' + id);
				return this;
			}

			return this.updateEntity(newEntity);
		}

		protected updateEntity(newEntity:Entity):GameState {
			var id = newEntity && newEntity.getId() || 0;
			var oldEntity = this.getEntity(id);
			if (!oldEntity) {
				console.error('Cannot update non-existent entity #' + id);
				return this;
			}

			// verify entity has actually changed
			if (newEntity === oldEntity) {
				console.warn('Update has no effect on entity #' + id);
				return this;
			}

			// update global entity list
			var entities = this.entities.set(id, newEntity);

			// update entity tree
			var entityTree = this.entityTree.withMutations(function (map) {
				map.deleteIn([oldEntity.getController(), oldEntity.getZone(), id])
					.setIn([newEntity.getController(), newEntity.getZone(), id], newEntity);
			});

			return new GameState(entities, entityTree, this.options);
		}
	}
}
