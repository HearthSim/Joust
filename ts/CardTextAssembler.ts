import * as Immutable from "immutable";
import { CardData } from "hearthstonejson-client";
import Entity from "./Entity";
import { GameTag } from "./enums";

/**
 * Assemble: a minion is added to hand, then part of its card text is replaced
 * with the text of another minion from a curated pool.
 *
 * Cards in that pool have their text split into two halves by an ampersand -
 * the trigger ("After your hero attacks,&") and the effect ("& Gain 3 Armor.").
 * An assembled entity keeps the half it contributes itself and names the card
 * donating the other half in MODULAR_ENTITY_PART_1 (first half) or
 * MODULAR_ENTITY_PART_2 (second half), as a dbfId.
 *
 * The same tags are also set to 1 on the cards offered as parts, to mark which
 * half they would contribute; such a marker is not a card reference.
 */
export const HALF_DELIMITER = "&";

const PART_MARKER = 1;

/**
 * Trailing gameplay metadata, e.g. "~GAMEPLAY ASPROXY BE 997".
 */
const TEXT_METADATA = /~.*$/;

/**
 * Removes the markers that describe the text rather than being part of it: the
 * assembly delimiter and trailing gameplay metadata. Safe to apply to any card
 * text - a bare ampersand is never used as an HTML entity in card text.
 */
export function stripCardTextMarkers(text: string): string {
	if (!text) {
		return "";
	}
	return text
		.replace(TEXT_METADATA, "")
		.split(HALF_DELIMITER)
		.join("")
		.trim();
}

/**
 * Strips the markers that only make sense on a single, unassembled card:
 * alternate text variants ("text@variant"), trailing gameplay metadata, the
 * "[x]" manual line break flag and non-breaking spaces.
 */
export function normalizeCardText(text?: string): string {
	if (!text) {
		return "";
	}
	return text
		.split("@")[0]
		.replace(TEXT_METADATA, "")
		.replace(/^\[x\]/, "")
		.replace(new RegExp(String.fromCharCode(160), "g"), " ")
		.trim();
}

export interface CardTextHalves {
	/** The trigger, before the delimiter. */
	first: string;
	/** The effect, after the delimiter. */
	second: string;
	/** Whether the text actually carries the delimiter. */
	delimited: boolean;
}

/**
 * Splits card text into the two halves assembly works with. Text without a
 * delimiter cannot be split, so either half is the whole text.
 */
export function splitCardHalves(text?: string): CardTextHalves {
	const normalized = normalizeCardText(text);
	const delimiter = normalized.indexOf(HALF_DELIMITER);
	if (delimiter === -1) {
		return { first: normalized, second: normalized, delimited: false };
	}
	return {
		first: normalized.substr(0, delimiter).trim(),
		second: normalized.substr(delimiter + 1).trim(),
		delimited: true,
	};
}

/**
 * Combines the first half of the card contributing it with the second half of
 * the card contributing that, falling back to the assembled card's own text for
 * whichever half it keeps.
 *
 * Returns null unless both source texts carry the delimiter: text from a build
 * that predates the mechanic has no halves to combine, and joining it whole
 * would describe a card that does not exist.
 */
export function assembleCardText(
	own?: CardData,
	part1?: CardData,
	part2?: CardData,
): string | null {
	const from = splitCardHalves((part1 || own || ({} as CardData)).text);
	const to = splitCardHalves((part2 || own || ({} as CardData)).text);
	if (!from.delimited || !to.delimited) {
		return null;
	}
	const halves = [from.first, to.second].filter((half: string) => !!half);
	if (!halves.length) {
		return null;
	}
	return halves.join(" ");
}

/**
 * Returns the assembled card text for an entity, or null if the entity was not
 * assembled or its parts cannot be resolved - in which case the caller should
 * fall back to the regular card text.
 */
export function getAssembledCardText(
	entity: Entity,
	own?: CardData,
	cardsByDbfId?: Immutable.Map<number, CardData>,
): string | null {
	if (!entity) {
		return null;
	}
	const dbfIds = [
		GameTag.MODULAR_ENTITY_PART_1,
		GameTag.MODULAR_ENTITY_PART_2,
	].map((tag: GameTag) => {
		const value = entity.getTag(tag);
		// a marker says this card is offered as a part, it does not name one
		return value > PART_MARKER ? value : 0;
	});
	if (!dbfIds.some((dbfId: number) => !!dbfId)) {
		// not an assembled entity
		return null;
	}
	if (!cardsByDbfId) {
		// metadata has not loaded yet
		return null;
	}
	const parts = dbfIds.map(
		(dbfId: number) => (dbfId ? cardsByDbfId.get(dbfId) : null),
	);
	if (!parts.some((part: CardData) => !!part)) {
		// none of the parts are in the metadata for this build
		return null;
	}
	return assembleCardText(own, parts[0], parts[1]);
}
