import * as React from "react";
import MessagePicker from "./MessagePicker";

interface LoadingScreenProps extends React.ClassAttributes<LoadingScreen> {
	players?: string[];
}

export default class LoadingScreen extends React.Component<LoadingScreenProps> {
	private messages = [
		// Card games
		"Sorting decks...",
		"Summoning heroes...",
		"Nerfing cards...",
		"Buffing cards...",
		"Painting cards...",
		"Tossing coin...",
		"Calculating lethal...",
		"Dusting collection...",
		"Deploying anti-cheats...",
		"Writing new spinner text...",

		// Innkeeper
		"Warming frozen boots...",
		"Finding room for another...",

		// Classic
		"Watching your back...",
		"Overloading...",
		"Unlocking Overload...",
		"Armoring up...",
		"Enraging Worgen...",
		"Feeding Hungry Crab...",
		"Rolling Need...",

		// Goblins vs Gnomes
		"Spinning up...",
		"Summoning Boom Bots...",
		"Piloting Shredder...",

		// Naxxramas
		"Poisoning seeds...",

		// Blackrock Mountain
		"Hatching Dragon Eggs...",
		"Getting everyone in here...",

		// Grand Tournament
		"Funneling Cakes...",
		"Managing Coliseum...",

		// League
		"Excavating Evil...",
		"Finding Golden Monkey...",
		"Stealing Artifacts...",

		// Old Gods
		"Spreading Madness...",
		"Spreading C'Thun's word...",

		// Karazhan
		"Guarding the Menagerie...",
		"Clawing Spirits...",
		"Purifying...",

		// Mean Streets
		"Loading Cannon...",
		"Patching Patches...",

		// Un'Goro
		"Rerolling Quests...",
		"Hunting for Dinosaurs...",

		// Saviors of Uldum
		"Saving Uldum...",
		"Wishing for perfect card...",

		// Descent of Dragons & Galakrond's Awakening
		"Awakening Galakrond...",
		"Praising Galakrond...",

		// Demon Hunter Initiate
		"Slicing Twice...",
		"Consuming Magic...",

		// Ashes of Outlands
		"Running from Crimson Sigil...",
		"Holding Gul'dan's Skull...",

		// Greetings
		'"Well met!"',
		'"Taz\'dingo!"',

		// Meme
		"Trading for value...",
		"Prep-Coin-Conceding...",
		"Befriending recent opponent...",
		"Going face...",
		"Stream-sniping...",
		"Curving perfectly...",
		"Milling Reno...",
		"Creeping power...",
		"Going full Northshire...",
		"Dropping a 4 mana 7/7...",
		"Removing Sorry emote...",
		"Restoring Sorry emote...",
		"Rounding pie charts ...",
		"Unlocking more deck slots...",

		// other games
		"Massing Void Rays...",
		"Assembling Exodia pieces...",
	];

	public render() {
		let players = String.fromCharCode(160); // &nbsp;

		if (this.props.players && this.props.players.length) {
			switch (this.props.players.length) {
				case 1:
					players = this.props.players[0];
					break;
				case 2:
					players =
						this.props.players[0] + " vs. " + this.props.players[1];
					break;
			}
		}

		return (
			<div className="joust-loading-screen">
				{this.props.children ? (
					this.props.children
				) : (
					<p>
						<MessagePicker interval={2} messages={this.messages} />
					</p>
				)}
				<p className="participants">{players}</p>
			</div>
		);
	}
}
