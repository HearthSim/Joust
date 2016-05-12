import * as React from "react";
import PlayerEntity from "../Player";
import {AssetDirectoryProps} from "../interfaces";

interface LoadingScreenProps extends AssetDirectoryProps, React.Props<any> {
	players?: Immutable.Iterable<number, PlayerEntity>;
}

class LoadingScreen extends React.Component<LoadingScreenProps, {}> {

	private currentMessage: string;
	private lastUpdate = 0;
	private messages = ['Sorting decks...', 'Painting cards...', 'Calculating lethal...', 'Calling customer service...',
		'SMOrc', 'Verifying the face is the place...', 'Summoning heroes...', 'Nerfing cards...', 'Buffing cards...'];


	private getMessage(): string {
		var now = new Date().getTime();
		if (!!this.messages.length && (now - this.lastUpdate) > 3000) {
			var index = Math.floor(Math.random()*this.messages.length);
			this.currentMessage = this.messages.splice(index, 1)[0];
			this.lastUpdate = now;
		}
		return this.currentMessage;
	}

	public render(): JSX.Element {
		return 	<div className="loading-screen">{this.props.players ?
			<div className="info">
				<span className="left">{this.props.players.first().getName()}</span>
				<span className="center">VS</span>
				<span className="right">{this.props.players.last().getName()}</span>
			</div> : <div className="info"/>}
			<img className="logo" src={this.props.assetDirectory + 'images/logo.png'} />
			<span className="info joust-message">{this.getMessage()}</span>
		</div>;
	}
}

export default LoadingScreen;
