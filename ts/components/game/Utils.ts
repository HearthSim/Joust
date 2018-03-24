import * as Immutable from "immutable";
import Entity from "../../Entity";

export function findCreator(creatorId:number, entities:Immutable.Map<number, Immutable.Map<number, Entity>>) {
	let creator = null;
	entities.forEach((map: Immutable.Map<number, Entity>) => {
		map.forEach((toCompare: Entity) => {
			if (toCompare.id === creatorId) {
				creator = toCompare;
			}
		});
	});
	return creator;
}
