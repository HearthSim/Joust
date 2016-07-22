import Entity from "./Entity";

class Player extends Entity {
	protected _name:string;
	protected _playerId:number;
	protected _rank:number;
	protected _legendRank:number;

	constructor(id:number, tags:Immutable.Map<string, number>, playerId:number, name:string, rank?:number, legendRank?:number) {
		super(id, tags);
		this._playerId = playerId;
		this._name = name;
		this._rank = rank;
		this._legendRank = legendRank;
	}

	get playerId():number {
		return this._playerId;
	}

	get name():string {
		return this._name;
	}

	get rank():number {
		return this._rank;
	}

	get legendRank():number {
		return this._legendRank;
	}

	public toString():string {
		return "Player #" + this.id + " (playerId: " + this.playerId + ", name: \"" + this.name + "\")";
	}

	protected factory(tags:Immutable.Map<string, number>, cardId:string):Player {
		return new Player(this.id, tags, this.playerId, this.name, this.rank, this.legendRank);
	}
}

export default Player;
