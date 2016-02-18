import * as React from "react";
import {CardType} from "../../enums";
var Dimensions = require('react-dimensions');

class HeroArt extends React.Component<any, {}> {
	public render():JSX.Element {
		// fit container and keep proportions
		var divWidth = this.props.containerHeight;
		var style = {
			width: divWidth + 'px',
			height: divWidth + 'px'
		};

		var imgDir = (this.props.assetDirectory || "./assets/") + "images/";
		var base = imgDir + "hero.png";
		var portrait = imgDir + "portrait.png";

		// when card art is available
		var cardArtBaseUrl = "http://cardart-andburn.rhcloud.com/";
		if (this.props.cardId) {
			portrait = cardArtBaseUrl + this.props.cardId + ".jpg";
		}

		return (
			<div className="visuals" style={style}>
				<img className="hero-portrait" src={portrait} draggable={false}/>
				<img className="hero-frame" src={base} draggable={false}/>
			</div>
		);
	}
}

export default Dimensions()(HeroArt);
