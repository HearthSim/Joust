import * as React from "react";
import {CardType} from "../../../enums";
import Entity from '../../../Entity';
import CardArt from "./CardArt";
import {EntityProps} from "../../../interfaces";
import InPlayCardArt from "./InPlayCardArt";

interface InHandCardArtProps extends EntityProps {
	hidden: boolean;
	cardType: number;
}

class InHandCardArt extends React.Component<InHandCardArtProps, {}> {
	public render(): JSX.Element {
		var images = [];
		var entity = this.props.entity;
		var portraitClass = null;
		var frame = null;

		if (this.props.hidden) {
			images.push({
				image: "cardback.png",
				classes: ["inhand-base", "cardback"]
			});
		} else {
			switch (this.props.cardType) {
				case CardType.MINION:
					portraitClass = "inhand-minion";
					frame = "inhand_minion.png";
					break;
				case CardType.SPELL:
					portraitClass = "inhand-spell";
					frame = "inhand_spell.png";
					break;
				case CardType.WEAPON:
					portraitClass = "inhand-weapon";
					frame = "inhand_weapon.png";
					break;
			}

			images.push({
				image: InPlayCardArt.extractTexture(entity.getCardId(), this.props.cards),
				isArt: true,
				classes: [portraitClass]
			});
		}

		images.push({
			image: frame,
			classes: ["inhand-base"]
		});

		if (this.props.entity.isLegendary()) {
			images.push({
				image: "inhand_minion_legendary.png",
				classes: ["inhand-legendary"]
			});
		}

		return (
			<CardArt layers={images} scale={0.71} square={false} margin={false} assetDirectory={this.props.assetDirectory} textureDirectory={this.props.textureDirectory} />
		);
	}
}

export default InHandCardArt;
