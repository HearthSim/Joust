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
	optionCallback?(option:Option, target?:number):void;
}

class Application extends React.Component<{}, ApplicationState> {

	constructor() {
		super();
		this.state = {manager: null, optionCallback: null};
	}

	protected initializeSocket(client:Client):void {
		var manager = new SingleGameStateManager(new GameState());
		var kettle = new KettleTranscoder(manager);
		client.once('connect', function () {
			var cardList = Immutable.List<String>(Array(30));
			var webspinners = cardList.map(function () {
				return 'FP1_011';
			}).toJS();
			var portals = cardList.map(function () {
				return 'GVG_003';
			}).toJS();
			kettle.createGame('Player 1', 'HERO_08', webspinners,
				'Player 2', 'HERO_08', portals);
			this.setState({manager: manager});
		}.bind(this));
		client.once('close', function() {
			if(this.state.manager && !this.state.manager.isComplete()) {
				alert('Connection lost.');
			}
			this.setState({manager: null});
		}.bind(this));
		kettle.connect(client);
		this.setState({optionCallback: function(option:Option, target?:number) {
			kettle.sendOption(option, target);
			manager.apply(new ClearOptionsMutator());
		}});
	}

	public initializeKettleTCPSocket(hostname:string, port:number):void {
		this.initializeSocket(new TCPSocketClient(hostname, port));
	}

	public initializeKettleWebSocket(url:string):void {
		this.initializeSocket(new WebSocketClient(url));
	}

	protected close() {
		if(!confirm('Are you sure you want to exit the game?')) {
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
						<a href="#" className="close" onClick={this.close.bind(this)}><small>Exit Game </small>&times;</a>
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
									callbackWebSocket={this.initializeKettleWebSocket.bind(this)}/>
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
