import * as React from "react";
import MessagePicker from "./MessagePicker";

interface LoadingScreenProps extends React.Props<any> {
	players?: string[];
}

class LoadingScreen extends React.Component<LoadingScreenProps, {}> {
	private messages = [
		"Spinning up...",
		"Sorting decks...",
		"Calculating lethal...",
		"Summoning heroes...",
		"Nerfing cards...",
		"Buffing cards...",
		"Painting cards...",
		"Spreading Madness...",
		"Spreading C'Thun's word...",
		"Prep-Coin-Conceding...",
		"Funneling cakes...",
		"Tossing coin...",
		"Deploying anti-cheats...",
		"Disguising toast...",
		"Dropping a 4 mana 7/7...",
		"Assembling Exodia pieces...",
		"Going full Northshire...",
		"Stream-sniping...",
		"Overloading...",
		"Unlocking Overload...",
		"Unlocking more deck slots...",
		"Rolling Need...",
		"Shadowstepping Coldlights...",
		"Milling Reno...",
		"Warming frozen boots...",
		"Watching your back...",
		"Finding room for another...",
		"Getting everyone in here...",
		"Pressing the button...",
		"Requiring assistance...",
		"Removing Sorry emote...",
		"Restoring Sorry emote...",
		"Writing new spinner text...",
		'"Well met!"',
		'"Taz\'dingo!"',
		'"Ryuu ga waga teki oh wrong game."',
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
