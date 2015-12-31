/// <reference path='../node_modules/immutable/dist/immutable.d.ts'/>
'use strict';

import Entity = require('./Entity');

class Player extends Entity {
	protected playerId:number;

	constructor(id:number, tags:Immutable.Map<number, number>, playerId:number, cardId?:string) {
		super(id, tags, cardId);
		this.playerId = playerId;
	}

	public getPlayerId():number {
		return this.playerId;
	}

	protected factory(tags, cardId):Player {
		return new Player(this.id, tags, this.playerId, cardId);
	}
}

export = Player;
