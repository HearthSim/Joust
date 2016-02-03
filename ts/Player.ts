import Entity from './Entity';

class Player extends Entity {
	protected name:string;
	protected playerId:number;

	constructor(id:number, tags:Immutable.Map<string, number>, playerId:number, name:string, cardId?:string) {
		super(id, tags, cardId);
		this.playerId = playerId;
		this.name = name;
	}

	public getPlayerId():number {
		return this.playerId;
	}

	public getName():string {
		return this.name;
	}

	protected factory(tags, cardId):Player {
		return new Player(this.id, tags, this.playerId, this.name, cardId);
	}
}

export default Player;
