/// <reference path="../../typings/react/react.d.ts"/>
'use strict';

import React = require('react');
var Dimensions = require('react-dimensions');

class InHandCardArt extends React.Component<any, {}> {
	public render() {
		// fit container and keep proportions
		var divWidth = this.props.containerHeight * 0.71;
		var style = {
			width: divWidth + 'px',
			height: this.props.containerHeight + 'px'
		};

		var hidden = this.props.cardHidden;
		var imgDir = "./images/";
		var legendary = null;
		var baseClass = "inhand-base";
		var portraitClass = "inhand-minion";
		var base = imgDir + "inhand_minion.png";
		var portrait = imgDir + "portrait.jpg";

		// when card art is available
		// if (this.props.cardId) {
		// 	portrait = cardArtBaseUrl + this.props.cardId + ".jpg";
		// }
		if (hidden) {
			portrait = null;
			base = imgDir + "cardback.png";
		}
		if (this.props.cardType === 5) {
			portraitClass = "inhand-spell";
			base = imgDir + "inhand_spell.png";
		} else if (this.props.cardType === 7) {
			portraitClass = "inhand-weapon";
			base = imgDir + "inhand_weapon.png";
		}

		if (this.props.legendary) {
			legendary = <img className="inhand-legendary" src={imgDir + "inhand_minion_legendary.png"}/>;
		}

		return(
			<div className="visuals" style={style}>
				<img className={portraitClass} src={portrait} />
				<img className={baseClass} src={base} />
				{legendary}
			</div>
    );
	}
}

export = Dimensions()(InHandCardArt);
