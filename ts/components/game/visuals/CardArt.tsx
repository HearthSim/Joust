import * as React from "react";
import Dimensions from "react-dimensions";

interface CardArtItem {
	image: string;
	isArt?: boolean;
	classes: Array<String>;
}

interface CardArtProps {
	layers: Array<CardArtItem>;
	scale: number;
	square: boolean;
	margin: boolean;
	containerWidth: number;
	containerHeight: number;
	baseArtUrl?: string;
}

class CardArt extends React.Component<CardArtProps, {}> {

	private static baseArtExt:string = ".jpg";
	private static imageDirectory:string = "./assets/images/";

	private createStyle():any {
		// keep proportions with scale
		var width = Math.round(this.props.containerHeight * this.props.scale);
		var height = Math.round(this.props.containerHeight);
		if (this.props.square)
			height = width;
		var margin = Math.round(this.props.containerHeight * (1 - this.props.scale));
		var style = { width: width + 'px', height: height + 'px', marginTop: '0px' };
		if (this.props.margin)
			style.marginTop = margin + 'px';
		return style;
	}

	private createImageItem(item:CardArtItem, index:number):JSX.Element {
		if (item.image === null)
			return;

		var imgSrc = null;
		if (item.isArt) {
			if (this.props.baseArtUrl && this.props.baseArtUrl.length > 0)
				imgSrc = this.props.baseArtUrl + item.image + CardArt.baseArtExt;
			else
				imgSrc = CardArt.imageDirectory + "portrait.jpg";
		} else {
			imgSrc = CardArt.imageDirectory + item.image;
		}

		return (
			<img key={index}
				src={imgSrc}
				className={item.classes.join(' ')}
				draggable={false}
			/>
		);
	}

	public render():JSX.Element {
		var style = this.createStyle();
		return (
			<div className='visuals' style={style}>
				{ this.props.layers.map(this.createImageItem.bind(this)) }
			</div>
		);
	}
}

export default Dimensions()(CardArt);
