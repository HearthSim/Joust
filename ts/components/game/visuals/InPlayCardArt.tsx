import * as React from "react";
import {CardType, GameTag} from "../../../enums";
import Entity from "../../../Entity";
import CardArt from "./CardArt";
import {EntityProps, CardData} from "../../../interfaces";

class InPlayCardArt extends React.Component<EntityProps, {}> {

	public render(): JSX.Element {
		var images = [];
		var entity = this.props.entity;
		var controller = this.props.controller;

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

		if (entity.isFrozen()) {
			images.push({
				image: "inplay_minion_frozen.png",
				classes: ["inplay-frozen"]
			});
		}

		if (entity.isDivineShielded()) {
			images.push({
				image: "inplay_minion_divine_shield.png",
				classes: ["inplay-divine-shield"]
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

		if (entity.getTag(GameTag.NUM_TURNS_IN_PLAY) == 0 &&
			entity.getTag(GameTag.CHARGE) <= 0 &&
			(!controller || controller.getTag(GameTag.CURRENT_PLAYER))) {
			images.push({
				image: "effect_sleep.png",
				classes: ["effect-sleep"]
			});
		}

		if (entity.getTag(GameTag.HEALTH) - entity.getTag(GameTag.DAMAGE) <= 0) {
			images.push({
				image: "skull.png",
				classes: ["skull"]
			});
		}

		return (
			<CardArt layers={images} scale={0.86} square={false} margin={false}
				assetDirectory={this.props.assetDirectory}
				cardArtDirectory={this.props.cardArtDirectory}
				/>
		);
	}
}

export default InPlayCardArt;
