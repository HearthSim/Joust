import * as React from "react";
import {CardType} from "../../../enums";
import Entity from '../../../Entity';
import CardArt from "./CardArt";
import {EntityProps} from "../../../interfaces";

class HeroPowerArt extends React.Component<EntityProps, {}> {
	public render():JSX.Element {
		var images = [];
		var entity = this.props.entity;

		images.push({
			image: entity.getCardId(),
			isArt: true,
			classes: ["hero-power-portrait"]
		});

		var frame = "hero_power.png";
		if (entity.isExhausted())
			frame = "hero_power_exhausted.png";

		images.push({
			image: frame,
			classes: ["hero-power-frame"]
		});

		return (
			<CardArt layers={images} scale={0.6} square={true} margin={true} assetDirectory={this.props.assetDirectory} />
		);
	}
}

export default HeroPowerArt;
