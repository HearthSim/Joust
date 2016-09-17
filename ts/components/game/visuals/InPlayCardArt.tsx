import * as React from "react";
import {CardType, GameTag} from "../../../enums";
import CardArt from "./CardArt";
import {EntityProps, CardData} from "../../../interfaces";

class InPlayCardArt extends React.Component<EntityProps, {}> {

	shouldComponentUpdate(nextProps:EntityProps):boolean {
		return (
			nextProps.entity !== this.props.entity ||
			nextProps.damage !== this.props.damage ||
			nextProps.healing !== this.props.healing ||
			nextProps.controller !== this.props.controller ||
			nextProps.assetDirectory !== this.props.assetDirectory ||
			nextProps.cardArtDirectory !== this.props.cardArtDirectory
		);
	}

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
			image: entity.cardId,
			isArt: true,
			classes: ["inplay-portrait"]
		});

		if (entity.isStealthed()) {
			images.push({
				image: "inplay_minion_stealth.png",
				classes: ["inplay-stealth"]
			});
		}

		if (entity.getTag(GameTag.HIDE_STATS)) {
			images.push({
				image: "inplay_minion_hide_stats.png",
				classes: ["inplay-base"]
			});
		} else {
			images.push({
				image: "inplay_minion.png",
				classes: ["inplay-base"]
			});
		}

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

		if (entity.isAsleep(controller)) {
			images.push({
				image: "effect_sleep.png",
				classes: ["effect-sleep"]
			});
		}

		if(this.props.damage && this.props.damage > 0) {
			images.push({
				image: "damage.png",
				classes: ["dmg"]
			});
		}
		else if(this.props.healing && this.props.healing > 0) {
			images.push({
				image: "healing.png",
				classes: ["heal"]
			});
		}
		else if (entity.getTag(GameTag.HEALTH) - entity.getTag(GameTag.DAMAGE) <= 0) {
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
