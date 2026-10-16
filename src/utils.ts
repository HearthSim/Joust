import { GameType } from "./enums";

export function isBattlegrounds(gameType: GameType) {
	return (
		gameType === GameType.GT_BATTLEGROUNDS ||
		gameType === GameType.GT_BATTLEGROUNDS_FRIENDLY
	);
}
