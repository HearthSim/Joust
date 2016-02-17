/// <reference path="../typings/main.d.ts"/>
/// <reference path="./global.d.ts"/>
/// <reference path="../node_modules/immutable/dist/immutable.d.ts"/>

import {GameWidgetProps} from "./interfaces";
import Application from './components/Joust';
import GameWidget from "./components/GameWidget";
import GameStateSink from "./state/GameStateSink";
import GameStateTracker from "./state/GameStateTracker";
import HSReplayDecoder from "./protocol/HSReplayDecoder";
import GameStateScrubber from "./state/GameStateScrubber";
import * as http from "http";
import * as stream from "stream"
import * as URL from "url";

var React = require('react');
var ReactDOM = require('react-dom');

class Viewer {

	protected target;
	protected opts:GameWidgetProps;

	constructor(target:any) {
		this.target = target;
		this.opts = {} as any;
	}

	public width(width:number):Viewer {
		this.opts.width = width;
		return this;
	}

	public height(height:number):Viewer {
		this.opts.height = height;
		return this;
	}

	public assets(assets:string):Viewer {
		this.opts.assetDirectory = assets;
		return this;
	}

	public setOptions(opts:any):Viewer {
		for (var prop in opts) {
			this.opts[prop] = opts[prop];
		}
		return this;
	}

	public fromUrl(url:string):void {
		var scrubber = new GameStateScrubber();
		var decoder = new HSReplayDecoder();
		var sink = new GameStateSink();

		var opts = URL.parse(url) as any;
		opts.withCredentials = false;
		var request = http.get(opts);
		request.on('response', function (response:stream.Readable) {
			response // sink is returned by the last .pipe()
				.pipe(decoder) // json -> mutators
				.pipe(new GameStateTracker()) // mutators -> latest gamestate
				.pipe(scrubber) // gamestate -> gamestate emit on scrub past
				.pipe(sink); // gamestate
		});

		this.opts.sink = sink;
		this.opts.scrubber = scrubber;
		this.opts.cardOracle = decoder;

		this.render();
	}

	protected render():void {
		ReactDOM.render(
			React.createElement(GameWidget, this.opts),
			(typeof this.target !== 'string' ? this.target : document.getElementById(this.target))
		);
	}
}

module.exports = {
	renderApplication: (target:string) => {
		ReactDOM.render(
			React.createElement(Application),
			document.getElementById(target)
		);
	},

	renderHSReplay: (target:string, url:string, opts?) => {
		new Viewer(target).setOptions(opts).fromUrl(url);
	},

	viewer: (target) => {
		return new Viewer(target);
	}
}