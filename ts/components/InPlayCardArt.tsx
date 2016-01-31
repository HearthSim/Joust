/// <reference path="../../typings/react/react.d.ts"/>

import * as React from 'react';
var Dimensions = require('react-dimensions');

class InPlayCardArt extends React.Component<any, {}> {
	public render() {
		// fit container and keep proportions
		var divWidth = this.props.containerHeight * 0.94;
		var style = {
			width: divWidth + 'px',
			height: this.props.containerHeight + 'px'
		};

		var imgDir = "./images/";
		var taunter = null;
		var legendary = null;
		var portrait = imgDir + "portrait.jpg";

		if (this.props.taunt) {
			taunter = <img className="inplay-taunt" src={imgDir + "inplay_minion_taunt.png"}/>;
		}
		if (this.props.legendary) {
			legendary = <img className="inplay-legendary" src={imgDir + "inplay_minion_legendary.png"}/>;
		}
		// when card art is available
		// if (this.props.cardId) {
		// 	portrait = cardArtBaseUrl + this.props.cardId + ".jpg";
		// }

		return (
			<div className="visuals" style={style}>
				{taunter}
				<img className="inplay-portrait" src={portrait}/>
				<img className="inplay-base" src={imgDir + "inplay_minion.png"}/>
				{legendary}
			</div>
		);
	}
}

export default Dimensions()(InPlayCardArt);
