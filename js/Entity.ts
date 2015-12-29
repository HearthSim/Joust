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

        public getController():number {
            return this.getTag(50);
        }

        public getCardType():number {
            return this.getTag(202);
        }

        protected getTag(key:number) {
            return this.tags.toJS()[key] || 0;
        }

        public setTag(key:number, value:number) : Entity {
            var tags = this.tags.set(key, value);
            return new Entity(this.id, tags, this.cardId);
        }

        public getTags() {
            return this.tags;
        }
    }
}
