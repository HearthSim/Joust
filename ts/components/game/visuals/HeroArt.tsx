import * as React from "react";
import {CardType} from "../../../enums";
import Entity from '../../../Entity';
import CardArt from "./CardArt";

interface HeroArtProps {
	entity: Entity;
}

class HeroArt extends React.Component<HeroArtProps, {}> {
	public render():JSX.Element {
		var images = [];
		var entity = this.props.entity;

		images.push({
			image: entity.getCardId(),
			isArt: true,
			classes: ["hero-portrait"]
		});

		images.push({
			image: "hero_frame.png",
			classes: ["hero-frame"]
		});

		return (
			<CardArt layers={images} scale={1} square={true} margin={false} />
		);
	}
}

export default HeroArt;
