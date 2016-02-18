import * as React from "react";
var Dimensions = require('react-dimensions');

class InPlayCardArt extends React.Component<any, {}> {
	public render():JSX.Element {
		// fit container and keep proportions
		var divWidth = this.props.containerHeight * 0.94;
		var style = {
			width: divWidth + 'px',
			height: this.props.containerHeight + 'px'
		};

		var imgDir = (this.props.assetDirectory || "./assets/") + "images/";
		var taunter = null;
		var legendary = null;
		var portrait = imgDir + "portrait.jpg";

		if (this.props.taunt) {
			taunter = <img className="inplay-taunt" src={imgDir + "inplay_minion_taunt.png"} draggable={false}/>;
		}
		if (this.props.legendary) {
			legendary =
				<img className="inplay-legendary" src={imgDir + "inplay_minion_legendary.png"} draggable={false}/>;
		}

		// when card art is available
		var cardArtBaseUrl = "http://cardart-andburn.rhcloud.com/";
		if (this.props.cardId) {
			portrait = cardArtBaseUrl + this.props.cardId + ".jpg";
		}

		return (
			<div className="visuals" style={style}>
				{taunter}
				<img className="inplay-portrait" src={portrait} draggable={false}/>
				<img className="inplay-base" src={imgDir + "inplay_minion.png"} draggable={false}/>
				{legendary}
			</div>
		);
	}
}

export default Dimensions()(InPlayCardArt);
