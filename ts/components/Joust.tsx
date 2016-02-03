import * as React from "react";

import SetupWidget from "./SetupWidget";
import GameWidget from "./GameWidget";
import HearthstoneJSON from "../metadata/HearthstoneJSON";
import {InteractiveBackend} from "../interfaces";
import GameStateSink from "../state/GameStateSink";
import GameStateScrubber from "../state/GameStateScrubber";

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
}

class Joust extends React.Component<{}, JoustState> {

	constructor() {
		super();
		this.state = {
			currentWidget: Widget.SETUP,
			cards: null,
			sink: null,
			interaction: null,
			scrubber: null
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
								height="600"
								width="600"
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

	protected onSetup(sink:GameStateSink, interaction?:InteractiveBackend, scrubber?:GameStateScrubber):void {
		this.setState({
			currentWidget: Widget.GAME,
			sink: sink,
			interaction: interaction,
			scrubber: scrubber
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
			scrubber: null
		});
	}

	/*protected onConnect(Client:client):void {
	 this.setState({client: Client});
	 }*/

	/*constructor() {
	 super();
	 this.state = {manager: null, connecting: false, optionCallback: null};
	 }

	 protected initializeSocket(client:Client, hero1:string, deck1:string[], hero2:string, deck2:string[]):void {
	 var manager = new SingleGameStateManager(new GameState());
	 var kettle = new KettleTranscoder(manager);
	 client.once('connect', function () {
	 kettle.createGame(
	 "PlayerEntity 1", hero1, deck1,
	 "PlayerEntity 2", hero2, deck2
	 );
	 this.setState({manager: manager, connecting: false});
	 }.bind(this));
	 client.once('close', function () {
	 if (this.state.manager && !this.state.manager.isComplete()) {
	 alert("Connection lost.");
	 }
	 this.setState({manager: null, connecting: false});
	 }.bind(this));
	 client.once('error', function (err) {
	 alert("Connection failed.");
	 this.setState({manager: null, connecting: false});
	 }.bind(this));
	 kettle.connect(client);
	 this.setState({
	 connecting: true,
	 optionCallback: function (option:Option, target?:number, position?:number) {
	 kettle.sendOption(option, target, position);
	 manager.apply(new ClearOptionsMutator());
	 }
	 });
	 }

	 public initializeKettleTCPSocket(hostname:string, port:number, hero1:string, deck1:string[], hero2:string, deck2:string[]):void {
	 this.initializeSocket(new TCPSocketClient(hostname, port), hero1, deck1, hero2, deck2);
	 }

	 public initializeKettleWebSocket(url:string, hero1:string, deck1:string[], hero2:string, deck2:string[]):void {
	 this.initializeSocket(new WebSocketClient(url), hero1, deck1, hero2, deck2);
	 }

	 protected close() {
	 if (!confirm("Are you sure you want to exit the game?")) {
	 return;
	 }
	 this.state.manager.setComplete(true);
	 this.setState({manager: null});
	 }

	 public initializeHSReplay(stream) {
	 var manager = new HistoryGameStateManager(new GameState());
	 var scrubber = new GameStateScrubber(manager);
	 var hsreplay = new HSReplayDecoder(manager);
	 hsreplay.parseFromStream(stream);
	 this.setState({manager: scrubber});
	 scrubber.play();
	 }

	 public render():JSX.Element {
	 if (this.state.manager) {
	 var optionCallback = this.state.optionCallback ? this.state.optionCallback.bind(this) : this.state.optionCallback;
	 return (
	 <div id="application">
	 <div className="buttons">
	 <a href="#" className="close" onClick={this.close.bind(this)}><small>Exit Game</small>&times;
	 </a>
	 </div>
	 <JoustGame manager={this.state.manager} optionCallback={optionCallback}/>
	 </div>
	 );
	 }
	 else {
	 return (
	 <div id="application">
	 <div className="welcome">
	 <h1>Joust</h1>
	 <p>Welcome to Joust!</p>
	 <div className="backends">
	 <HSReplay callback={this.initializeHSReplay.bind(this)}/>
	 <Kettle callbackTCPSocket={this.initializeKettleTCPSocket.bind(this)}
	 callbackWebSocket={this.initializeKettleWebSocket.bind(this)}
	 connecting={this.state.connecting}/>
	 </div>
	 </div>
	 </div>
	 )
	 }
	 }*/
}

export default Joust;
