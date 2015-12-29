/// <reference path='../node_modules/immutable/dist/immutable.d.ts'/>
'use strict';

namespace Joust {
	export class Entity {
		constructor(private id:number, private tags:Immutable.Map<number, number>, private cardId?:string) {
		}

		public getId():number {
			return this.id;
		}

		public getCardId():string {
			return this.cardId;
		}

		public getZone():number {
			return this.getTag(49);
		}

		public getController():number {
			return this.getTag(50);
		}

		public getCardType():number {
			return this.getTag(202);
		}

		public getZonePosition():number {
			return this.getTag(263);
		}

		public getTag(key:number) {
			return this.tags ? (this.tags.toJS()[key] || 0) : 0;
		}

		public setTag(key:number, value:number):Entity {
			// verify parameters
			if (key === null) {
				console.warn('Attempted setting invalid tag on entity #' + this.getId());
				return this;
			}
			if (value === null) {
				value = 0;
			}

			var tags = this.tags;

			// delete value 0 tags
			if (value === 0) {
				tags = tags.withMutations(function (map) {
					// set to 0 to ensure it is really deleted
					map.set(key, 0).delete(key);
				});
			}
			else {
				tags = tags.set(key, value);
			}

			// verify tags have actually changed
			if (tags === this.tags) {
				return this;
			}

			return new Entity(this.id, tags, this.cardId);
		}

		public getTags() {
			return this.tags;
		}
	}
}
