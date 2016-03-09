import * as React from "react";
import CardArt from "./CardArt";
import {RankProps} from "../../../interfaces";

class RankArt extends React.Component<RankProps, {}> {
	public render():JSX.Element {
		var images = [];
		if(this.props.rank > 0 && this.props.rank <= 25) {
			images.push({
				image: "Medal_Ranked_" + this.props.rank + ".png",
				isArt: true,
				classes: ["rank-portrait"]
			});
			images.push({
				image: "rank_frame_" + Math.floor((this.props.rank - 1)/5) + ".png",
				classes: ["rank-frame"]
			});
		}
		else if (this.props.legendRank > 0) {
			images.push({
				image: "legend_rank.png",
				classes: ["rank-frame"]
			});
		}
		return (
			<CardArt layers={images} scale={1} square={false} margin={false} assetDirectory={this.props.assetDirectory} />
		);
	}
}

export default RankArt;
