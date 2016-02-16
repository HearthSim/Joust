/// <reference path="../typings/main.d.ts"/>
/// <reference path="./global.d.ts"/>
/// <reference path="../node_modules/immutable/dist/immutable.d.ts"/>

import Application from './components/Joust';
import GameWidget from "./components/GameWidget";
import GameStateSink from "./state/GameStateSink";
import GameStateTracker from "./state/GameStateTracker";
import HSReplayDecoder from "./protocol/HSReplayDecoder";
import GameStateScrubber from "./state/GameStateScrubber";
import * as http from "http";
import * as stream from "stream"

var React = require('react');
var ReactDOM = require('react-dom');

module.exports = {
	Application: Application,
	GameWidget: GameWidget,
	renderApplication(target:string) {
		ReactDOM.render(
			React.createElement(Application),
			document.getElementById(target)
		);
	},
	renderHSReplay(target:string, url:string, opts?) {
		var scrubber = new GameStateScrubber();
		var decoder = new HSReplayDecoder();

		var sink = new GameStateSink();

		var request = http.get(url);
		request.on('response', function(response:stream.Readable) {
			response // sink is returned by the last .pipe()
				.pipe(decoder) // json -> mutators
				.pipe(new GameStateTracker()) // mutators -> latest gamestate
				.pipe(scrubber) // gamestate -> gamestate emit on scrub past
				.pipe(sink); // gamestate
		});

		opts.sink = sink;
		opts.scrubber = scrubber;
		opts.oracle = decoder;

		ReactDOM.render(
			React.createElement(GameWidget, opts),
			document.getElementById(target)
		);
	}
};