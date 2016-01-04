/// <reference path="../../typings/react/react.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
'use strict';

import React = require('react');
import SingleGameStateManager = require("../state/managers/SingleGameStateManager");
import HistoryGameStateManager = require("../state/managers/HistoryGameStateManager");
import KettleTranscoder = require("../protocol/KettleTranscoder");
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

	public initializeHSReplay() {
		var manager = new HistoryGameStateManager(new GameState());
		var hsreplay = new HSReplayDecoder(manager);
		hsreplay.parseFromFile('sample.hsreplay');
		this.setState({manager: manager});
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
						<HSReplay/>
						<Kettle initializeKettle={this.initializeKettle.bind(this)} />
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
