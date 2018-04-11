import * as React from "react";
import { CardType } from "../../../enums";
import { GameTag } from "../../../enums";
import Entity from "../../../Entity";
import CardArt from "./CardArt";
import { EntityProps } from "../../../interfaces";
import InPlayCardArt from "./InPlayCardArt";

export default class WeaponArt extends React.Component<EntityProps> {
	public render(): JSX.Element {
		let images = [];
		let entity = this.props.entity;

		images.push({
			image: entity.cardId,
			isArt: true,
			classes: ["hero-weapon-portrait"],
		});

		let frame = "inplay_weapon.png";
		// TODO: weapon isn't actually sheathed when exhausted, end of turn
		if (entity.isExhausted()) frame = "inplay_weapon_dome.png";

		if (entity.getTag(GameTag.INSPIRE) > 0) {
			images.push({
				image: "icon_inspire.png",
				classes: ["icon-inspire"],
			});
		} else if (entity.getTag(GameTag.DEATHRATTLE) > 0) {
			images.push({
				image: "icon_deathrattle.png",
				classes: ["icon-deathrattle"],
			});
		} else if (entity.getTag(GameTag.POISONOUS) > 0) {
			images.push({
				image: "icon_poisonous.png",
				classes: ["icon-poisonous"],
			});
		} else if (entity.getTag(GameTag.TRIGGER_VISUAL) > 0) {
			images.push({
				image: "icon_trigger.png",
				classes: ["icon-trigger"],
			});
		}

		images.push({
			image: frame,
			classes: ["hero-weapon-frame"],
		});

		return (
			<CardArt
				layers={images}
				scale={1}
				square={true}
				margin={true}
				assetDirectory={this.props.assetDirectory}
				cardArtDirectory={this.props.cardArtDirectory}
			/>
		);
	}
}
