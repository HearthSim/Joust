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
		"Ensuring face is the place...",
		"Summoning heroes...",
		"Nerfing cards...",
		"Buffing cards...",
		"Spreading Madness...",
		"Spreading C'Thun's word...",
		"Prep-Coin-Conceding...",
		"Funneling cakes...",
		"Tossing coin...",
		"Disguising toast...",
		"Dropping a 4 mana 7/7...",
		"Going full Northshire...",
		"Unlocking Overload...",
		"Spinning up...",
		"Rolling Need...",
		"Watching your back...",
		"Finding room for another...",
		"Getting everyone in here...",
		"Pressing the button...",
		"Requiring assistance...",
		'"Well met!"',
		'"Taz\'dingo!"',
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
			<p><MessagePicker interval={2} messages={this.messages} /></p>
			<p className="participants">{players}</p>
		</div>;
	}
}

export default LoadingScreen;
