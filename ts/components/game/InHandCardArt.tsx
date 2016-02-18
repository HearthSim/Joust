import * as React from "react";
import {CardType} from "../../enums";
var Dimensions = require('react-dimensions');

class InHandCardArt extends React.Component<any, {}> {
	public render():JSX.Element {
		// fit container and keep proportions
		var divWidth = this.props.containerHeight * 0.71;
		var style = {
			width: divWidth + 'px',
			height: this.props.containerHeight + 'px'
		};

		var hidden = this.props.cardHidden;
		var imgDir = (this.props.assetDirectory || "./assets/") + "images/";
		var legendary = null;
		var baseClass = "inhand-base";
		var portraitClass = "inhand-minion";
		var base = imgDir + "inhand_minion.png";
		var portrait = imgDir + "portrait.jpg";

		// when card art is available
		var cardArtBaseUrl = "http://cardart-andburn.rhcloud.com/";
		if (this.props.cardId) {
			portrait = cardArtBaseUrl + this.props.cardId + ".jpg";
		}
		if (hidden) {
			portrait = null;
			base = imgDir + "cardback.png";
		}
		switch (this.props.cardType) {
			case CardType.SPELL:
				portraitClass = "inhand-spell";
				base = imgDir + "inhand_spell.png";
				break;
			case CardType.WEAPON:
				portraitClass = "inhand-weapon";
				base = imgDir + "inhand_weapon.png";
				break;
		}

		if (this.props.legendary) {
			legendary =
				<img className="inhand-legendary" src={imgDir + "inhand_minion_legendary.png"} draggable={false}/>;
		}

		return (
			<div className="visuals" style={style}>
				<img className={portraitClass} src={portrait} draggable={false}/>
				<img className={baseClass} src={base} draggable={false}/>
				{legendary}
			</div>
		);
	}
}

export default Dimensions()(InHandCardArt);
