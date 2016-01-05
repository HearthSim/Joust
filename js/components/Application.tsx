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

interface ApplicationState {
	manager:GameStateManager;
}

class Application extends React.Component<{}, ApplicationState> {

	constructor() {
		super();
		this.state = {manager: null};
	}

	public initializeKettle(hostname:string, port:number) {
		var manager = new SingleGameStateManager(new GameState());
		var kettle = new KettleTranscoder(manager);
		kettle.connect(port, hostname);
		this.setState({manager: manager});
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
			return (
				<JoustGame manager={this.state.manager}/>
			);
		}
		else {
			return (
				<div className="welcome">
					<h1>Joust</h1>
					<p>Welcome to Joust!</p>
					<div className="backends">
						<HSReplay callback={this.initializeHSReplay.bind(this)}/>
						<Kettle callback={this.initializeKettle.bind(this)}/>
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
