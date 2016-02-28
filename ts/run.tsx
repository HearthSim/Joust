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
import Joust from "./components/Joust";
import {CardData} from "./interfaces";
import {QueryCardMetadata} from "./interfaces";

var React = require('react');
var ReactDOM = require('react-dom');

var injectSVG = (element:HTMLElement) => {
	var svg = document.createElement('svg');
	svg.setAttribute('width', "0");
	svg.setAttribute('height', "0");
	svg.innerHTML = '\
			<svg width="0" height="0">\
				<clipPath id="inhand-minion-clip" clipPathUnits="objectBoundingBox">\
					<ellipse cx="0.5" cy="0.5" rx="0.36" ry="0.47" />\
				</clipPath>\
				<clipPath id="inhand-weapon-clip" clipPathUnits="objectBoundingBox">\
					<circle cx="0.5" cy="0.5" r="0.5" />\
				</clipPath>\
				<clipPath id="inhand-spell-clip" clipPathUnits="objectBoundingBox">\
					<rect x="0" y="0.08" width="100" height="0.88" />\
				</clipPath>\
				<clipPath id="inplay-minion-clip" clipPathUnits="objectBoundingBox">\
					<ellipse cx="0.51" cy="0.5" rx="0.35" ry="0.46" />\
				</clipPath>\
				<clipPath id="hero-power-clip" clipPathUnits="objectBoundingBox">\
					<circle cx="0.5" cy="0.5" r="0.6" />\
				</clipPath>\
				<clipPath id="hero-weapon-clip" clipPathUnits="objectBoundingBox">\
					<circle cx="0.5" cy="0.5" r="0.5" />\
				</clipPath>\
				<clipPath id="hero-clip" clipPathUnits="objectBoundingBox">\
					<polygon points="0 1, 0 0.4, 0.2 0.1, 0.3 0.03, 0.5 0, 0.7 0.03, 0.8 0.1, 1 0.4, 1 1" />\
				</clipPath>\
			</svg>';
	element.parentNode.insertBefore(svg, element);
}

class Viewer {

	protected target;
	protected opts:GameWidgetProps;
	protected queryCardMetadata:QueryCardMetadata;
	protected ref:GameWidget;

	constructor(target:any) {
		this.target = target;
		this.opts = {} as any;
		this.opts.assetDirectory = 'assets/';
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

	public metadata(query:QueryCardMetadata):Viewer {
		this.queryCardMetadata = query;
		return this;
	}

	public setOptions(opts:any):Viewer {
		for (var prop in opts) {
			this.opts[prop] = opts[prop];
		}
		return this;
	}

	public fromUrl(url:string):void {
		var decoder = new HSReplayDecoder();
		var tracker = new GameStateTracker();
		var scrubber = new GameStateScrubber();
		var sink = new GameStateSink();

		var opts = URL.parse(url) as any;
		opts.withCredentials = false;
		var request = http.get(opts);
		request.on('response', function (response:stream.Readable) {
			response
				.pipe(decoder) // json -> mutators
				.pipe(tracker) // mutators -> latest gamestate
				.pipe(scrubber) // gamestate -> gamestate emit on scrub past
				.pipe(sink); // gamestate
		});
		decoder.once('data', () => {
			if(this.queryCardMetadata) {
				this.queryCardMetadata(decoder.build, this.ref.setCards.bind(this.ref));
			}
		});

		this.opts.sink = sink;
		this.opts.scrubber = scrubber;
		this.opts.cardOracle = decoder;

		this.render();
	}

	protected render():void {
		let element = (typeof this.target !== 'string' ? this.target : document.getElementById(this.target));
		injectSVG(element);
		this.ref = ReactDOM.render(
			React.createElement(GameWidget, this.opts),
			element
		);
	}
}

module.exports = {
	renderApplication: (target:string) => {
		let element = document.getElementById(target);
		injectSVG(element);
		ReactDOM.render(
			React.createElement(Application),
			element
		);
	},

	renderHSReplay: (target:string, url:string, opts?) => {
		new Viewer(target).setOptions(opts).fromUrl(url);
	},

	viewer: (target) => {
		return new Viewer(target);
	}
}