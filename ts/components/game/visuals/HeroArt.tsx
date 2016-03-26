import * as React from "react";
import {CardType, GameTag} from "../../../enums";
import Entity from '../../../Entity';
import CardArt from "./CardArt";
import {EntityProps} from "../../../interfaces";
import InPlayCardArt from "./InPlayCardArt";

class HeroArt extends React.Component<EntityProps, {}> {
	public render(): JSX.Element {
		var images = [];
		var entity = this.props.entity;

		images.push({
			image: InPlayCardArt.extractTexture(entity.getCardId(), this.props.cards),
			isArt: true,
			classes: ["hero-portrait"]
		});

		images.push({
			image: "hero_frame.png",
			classes: ["hero-frame"]
		});

		if (entity.getAtk() > 0) {
			images.push({
				image: "hero_attack.png",
				classes: ["hero-attack"]
			});
		}

		if (entity.getArmor() > 0) {
			images.push({
				image: "hero_armor.png",
				classes: ["hero-armor"]
			});
		}

		return (
			<CardArt layers={images} scale={1} square={true} margin={false}
				assetDirectory={this.props.assetDirectory}
				textureDirectory={this.props.textureDirectory}
				/>
		);
	}
}

export default HeroArt;
