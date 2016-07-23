import * as React from "react";
import MessagePicker from "./MessagePicker";

interface LoadingScreenProps extends React.Props<any> {
	players?: string[];
}

class LoadingScreen extends React.Component<LoadingScreenProps, {}> {
	private messages = [
		"Sorting decks...",
		"Painting cards...",
		"Calculating lethal...",
		"SMOrc",
		"Ensuring face is the place...",
		"Summoning heroes...",
		"Nerfing cards...",
		"Buffing cards...",
		"Spreading Madness...",
		"Spreading C'Thun's word...",
		"Increasing base armor by 1...",
		"Prep-Coin-Conceding...",
		"Funneling cakes...",
		"Tossing coin...",
		"Well met!",
		"Disguising toast...",
		"Calling the cavalry...",
	];

	public render() {
		let players = String.fromCharCode(160); // &nbsp;

		if(this.props.players) {
			switch(this.props.players.length) {
				case 1:
					players = this.props.players[0];
					break;
				case 2:
					players = this.props.players[0] + " vs. " + this.props.players[1];
					break;

			}
		}

		return <div className="joust-loading-screen">
			<p><MessagePicker interval={3} messages={this.messages} /></p>
			<p className="participants">{players}</p>
		</div>;
	}
}

export default LoadingScreen;
