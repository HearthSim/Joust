/// <reference path="../../typings/react/react.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
'use strict';

import React = require('react');
import SingleGameStateManager = require("../state/managers/SingleGameStateManager");
import KettleTranscoder = require("../protocol/KettleTranscoder");
import HistoryGameStateManager = require("../state/managers/HistoryGameStateManager");
import GameStateScrubber = require("../state/GameStateScrubber");
import HSReplayDecoder = require("../protocol/HSReplayDecoder");
import JoustGame = require('./JoustGame');
import GameState = require("../state/GameState");
import HearthstoneJSON = require('../metadata/HearthstoneJSON');
import {GameStateManager} from "../interfaces";

import HSReplay = require('./welcome/HSReplay')
import Kettle = require('./welcome/Kettle')
import TCPSocketClient = require('../protocol/TCPSocketClient');
import WebSocketClient = require('../protocol/WebSocketClient');
import Immutable = require('immutable');
import {Client} from "../interfaces";
import ClearOptionsMutator = require("../state/mutators/ClearOptionsMutator");
import Option = require("../Option");


interface ApplicationState {
	manager?:GameStateManager;
	connecting?:boolean;
	optionCallback?(option:Option, target?:number):void;
}

class Application extends React.Component<{}, ApplicationState> {

	constructor() {
		super();
		this.state = {manager: null, connecting: false, optionCallback: null};
	}

	protected initializeSocket(client:Client, hero1:string, deck1:string[], hero2:string, deck2:string[]):void {
		var manager = new SingleGameStateManager(new GameState());
		var kettle = new KettleTranscoder(manager);
		client.once('connect', function () {
			kettle.createGame(
				"Player 1", hero1, deck1,
				"Player 2", hero2, deck2
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
			optionCallback: function (option:Option, target?:number) {
				kettle.sendOption(option, target);
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

	public render() {
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
	}

	public componentDidMount() {
		HearthstoneJSON.fetch();
	}
}

export = Application;
