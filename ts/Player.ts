import Entity from './Entity';

class Player extends Entity {
	protected name:string;
	protected playerId:number;
	protected rank:number;
	protected legendRank:number;

	constructor(id:number, tags:Immutable.Map<string, number>, playerId:number, name:string, cardId?:string, rank?:number, legendRank?:number) {
		super(id, tags, cardId);
		this.playerId = playerId;
		this.name = name;
		this.rank = rank;
		this.legendRank = legendRank;
	}

	public getPlayerId():number {
		return this.playerId;
	}

	public getName():string {
		return this.name;
	}

	public getRank():number {
		return this.rank;
	}

	public getLegendRank():number {
		return this.legendRank;
	}

	protected factory(tags, cardId):Player {
		return new Player(this.id, tags, this.playerId, this.name, cardId, this.rank, this.legendRank);
	}
}

export default Player;
