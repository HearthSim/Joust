import * as React from "react";
import {CardType, GameTag} from "../../../enums";
import Entity from '../../../Entity';
import CardArt from "./CardArt";

interface InPlayCardArtProps {
	entity: Entity;
}

class InPlayCardArt extends React.Component<InPlayCardArtProps, {}> {
	public render():JSX.Element {
		var images = [];
		var entity = this.props.entity;

		if (entity.isTaunter()) {
			images.push({
				image: "inplay_minion_taunt.png",
				classes: ["inplay-taunt"]
			});
		}

		images.push({
			image: entity.getCardId(),
			isArt: true,
			classes: ["inplay-portrait"]
		});

		images.push({
			image: "inplay_minion.png",
			classes: ["inplay-base"]
		});

		if (entity.isLegendary()) {
			images.push({
				image: "inplay_minion_legendary.png",
				classes: ["inplay-legendary"]
			});
		}

		if (entity.getTag(GameTag.INSPIRE) > 0) {
			images.push({
				image: "icon_inspire.png",
				classes: ["icon-inspire"]
			});
		} else if (entity.getTag(GameTag.DEATHRATTLE) > 0) {
			images.push({
				image: "icon_deathrattle.png",
				classes: ["icon-deathrattle"]
			});
		} else if (entity.getTag(GameTag.POISONOUS) > 0) {
			images.push({
				image: "icon_poisonous.png",
				classes: ["icon-poisonous"]
			});
		} else if (entity.getTag(GameTag.TRIGGER_VISUAL) > 0) {
			images.push({
				image: "icon_trigger.png",
				classes: ["icon-trigger"]
			});
		}

		if (entity.getTag(GameTag.NUM_TURNS_IN_PLAY) == 0
				&& entity.getTag(GameTag.CHARGE) <= 0) {
			images.push({
				image: "effect_sleep.png",
				classes: ["effect-sleep"]
			});
		}

		return (
			<CardArt layers={images} scale={0.86} square={false} margin={false} />
		);
	}
}

export default InPlayCardArt;
