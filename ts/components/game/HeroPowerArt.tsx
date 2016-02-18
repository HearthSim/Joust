import * as React from "react";
import {CardType} from "../../enums";
var Dimensions = require('react-dimensions');

class HeroPowerArt extends React.Component<any, {}> {
	public render():JSX.Element {
		// fit container and keep proportions
		var divWidth = Math.round(this.props.containerHeight * 0.6);
		var topMargin = Math.round(this.props.containerHeight * 0.4);
		var style = {
			width: divWidth + 'px',
			height: divWidth + 'px',
			'margin-top': topMargin + 'px'
		};

		var imgDir = (this.props.assetDirectory || "./assets/") + "images/";
		var base = imgDir + "hero_power.png";
		if (this.props.exhausted) {
			base = imgDir + "hero_power_exhausted.png";
		}
		var portrait = imgDir + "hero_portrait.png";

		// when card art is available
		var cardArtBaseUrl = "http://cardart-andburn.rhcloud.com/";
		if (this.props.cardId) {
			portrait = cardArtBaseUrl + this.props.cardId + ".jpg";
		}

		return (
			<div className="visuals" style={style}>
				<img className="hero-power-portrait" src={portrait} draggable={false}/>
				<img className="hero-power-frame" src={base} draggable={false}/>
			</div>
		);
	}
}

export default Dimensions()(HeroPowerArt);
