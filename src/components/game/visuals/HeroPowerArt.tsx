import * as React from "react";
import CardArt from "./CardArt";
import { EntityProps } from "../../../interfaces";

export default class HeroPowerArt extends React.Component<EntityProps> {
	public render(): JSX.Element {
		const images = [];
		const entity = this.props.entity;

		images.push({
			image: entity.cardId,
			isArt: true,
			classes: ["hero-power-portrait"],
		});

		let frame = "hero_power.png";
		if (entity.isExhausted()) {
			frame = "hero_power_exhausted.png";
		}

		images.push({
			image: frame,
			classes: ["hero-power-frame"],
		});

		return (
			<CardArt
				layers={images}
				scale={1}
				square
				margin
				assetDirectory={this.props.assetDirectory}
				cardArtDirectory={this.props.cardArtDirectory}
			/>
		);
	}
}
