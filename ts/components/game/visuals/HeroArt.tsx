import * as React from "react";
import {CardClass, CardType, GameTag, Zone} from "../../../enums";
import Entity from "../../../Entity";
import CardArt from "./CardArt";
import {EntityProps} from "../../../interfaces";
import InPlayCardArt from "./InPlayCardArt";

interface HeroArtProps extends EntityProps {
	secrets: Immutable.Map<number, Entity>;
}

class HeroArt extends React.Component<HeroArtProps, {}> {
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

		var secretCount = this.props.secrets.count();
		if (secretCount > 0) {
			var image = "secret_sheathed.png";
			var secret = this.props.secrets.first();
			if (!secret.getTag(GameTag.EXHAUSTED)) {
				switch (secret.getClass()) {
					case CardClass.HUNTER:
						image = "secret_hunter.png";
						break;
					case CardClass.MAGE:
						image = "secret_mage.png";
						break;
					case CardClass.PALADIN:
						image = "secret_paladin.png";
						break;
				}
			}
			images.push({
				image: image,
				classes: ["secret"]
			});
		}

		if (entity.getTag(GameTag.HEALTH) - entity.getTag(GameTag.DAMAGE) <= 0 || entity.getTag(GameTag.ZONE) != Zone.PLAY) {
			images.push({
				image: "skull.png",
				classes: ["skull"]
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
