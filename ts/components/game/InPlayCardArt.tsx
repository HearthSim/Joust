import * as React from "react";
import {GameTag} from "../../enums";
var Dimensions = require('react-dimensions');

class InPlayCardArt extends React.Component<any, {}> {
	public render():JSX.Element {
		// fit container and keep proportions
		var divWidth = this.props.containerHeight * 0.86;
		var style = {
			width: divWidth + 'px',
			height: this.props.containerHeight + 'px'
		};

		var imgDir = (this.props.assetDirectory || "./assets/") + "images/";
		var taunter = null;
		var effectIcon = null;
		var legendary = null;
		var portrait = imgDir + "portrait.jpg";
		var entity = this.props.entity;

		if (this.props.taunt) {
			taunter = <img className="inplay-taunt" src={imgDir + "inplay_minion_taunt.png"} draggable={false}/>;
		}
		if (this.props.legendary) {
			legendary =
				<img className="inplay-legendary" src={imgDir + "inplay_minion_legendary.png"} draggable={false}/>;
		}

		if (entity.getTag(GameTag.INSPIRE) > 0) {
			effectIcon = <img className="icon-inspire" src={imgDir + "icon_inspire.png"} draggable={false}/>;
		}
		else if (entity.getTag(GameTag.DEATHRATTLE) > 0) {
			effectIcon = <img className="icon-deathrattle" src={imgDir + "icon_deathrattle.png"} draggable={false}/>;
		}
		else if (entity.getTag(GameTag.POISONOUS) > 0) {
			effectIcon = <img className="icon-poisonous" src={imgDir + "icon_poisonous.png"} draggable={false}/>;
		}
		else if (entity.getTag(GameTag.TRIGGER_VISUAL) > 0) {
			effectIcon = <img className="icon-trigger" src={imgDir + "icon_trigger.png"} draggable={false}/>;
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
				{effectIcon}
			</div>
		);
	}
}

export default Dimensions()(InPlayCardArt);
