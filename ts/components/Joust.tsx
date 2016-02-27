import * as React from "react";

import SetupWidget from "./SetupWidget";
import GameWidget from "./GameWidget";
import HearthstoneJSON from "../metadata/HearthstoneJSON";
import {InteractiveBackend} from "../interfaces";
import GameStateSink from "../state/GameStateSink";
import GameStateScrubber from "../state/GameStateScrubber";
import {CardOracle} from "../interfaces";

const enum Widget {
	SETUP,
	GAME
}

interface JoustState {
	currentWidget?:Widget;
	cards?:any;
	sink?:GameStateSink;
	scrubber?:GameStateScrubber;
	interaction?:InteractiveBackend;
	oracle?:CardOracle;
}

class Joust extends React.Component<{}, JoustState> {

	constructor() {
		super();
		this.state = {
			currentWidget: Widget.SETUP,
			cards: null,
			sink: null,
			interaction: null,
			scrubber: null,
			oracle: null
		};
	}

	public componentDidMount() {
		var jsonClient = new HearthstoneJSON("https://api.hearthstonejson.com/v1/latest/enUS/cards.json");
		jsonClient.on("cards", function (cards:Immutable.Map<string, any>) {
			this.setState({cards: cards});
		}.bind(this));
		jsonClient.load();
	}

	public render():JSX.Element {
		var widget = null;
		switch (this.state.currentWidget) {
			case Widget.SETUP:
				widget = <SetupWidget defaultHostname="localhost" defaultPort={9111}
									  onSetup={this.onSetup.bind(this)}/>;
				break;
			case Widget.GAME:
				widget =
					<GameWidget cards={this.state.cards} sink={this.state.sink}
								interaction={this.state.interaction}
								scrubber={this.state.scrubber}
								exitGame={this.exitGame.bind(this)}
								cardOracle={this.state.oracle}
								assetDirectory={'./assets/'}
					/>;
				break;
		}

		return (
			<div className="joust">
				<h1>Joust</h1>
				{widget}
				<footer>
					<p>
						Not affiliated with Blizzard. Get Hearthstone at
						<a href="battle.net/hearthstone/">Battle.net</a>
						.
					</p>
				</footer>
			</div>
		);
	}

	protected onSetup(sink:GameStateSink, interaction?:InteractiveBackend, scrubber?:GameStateScrubber, oracle?:CardOracle):void {
		this.setState({
			currentWidget: Widget.GAME,
			sink: sink,
			interaction: interaction,
			scrubber: scrubber,
			oracle: oracle
		});
	}

	protected exitGame() {
		this.state.sink.end();
		if (this.state.interaction) {
			this.state.interaction.exitGame();
		}
		this.setState({
			currentWidget: Widget.SETUP,
			sink: null,
			interaction: null,
			scrubber: null,
			oracle: null
		});
	}
}

export default Joust;
