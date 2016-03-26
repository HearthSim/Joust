import * as React from "react";
import {RankProps} from "../../interfaces"
import RankArt from "./visuals/RankArt"

class Rank extends React.Component<RankProps, {}> {
    public render(): JSX.Element {
        if (this.props.rank > 0) {
            return (
                <div className="rank">
                    <RankArt rank={this.props.rank} assetDirectory={this.props.assetDirectory} textureDirectory={this.props.textureDirectory}/>
                    <div className="rank-text">
                        {this.props.rank}
                    </div>
                </div>
            );
        }
        if (this.props.legendRank > 0) {
            return (
                <div className="rank">
                    <RankArt legendRank={this.props.legendRank} assetDirectory={this.props.assetDirectory} textureDirectory={this.props.textureDirectory}/>
                    <div className="legend-text">
                        {this.props.legendRank}
                    </div>
                </div>
            );
        }
        return null;
    }
}

export default Rank;
