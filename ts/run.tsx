/// <reference path="../typings/browser.d.ts"/>
/// <reference path="./global.d.ts"/>
/// <reference path="../node_modules/immutable/dist/immutable.d.ts"/>

import {GameWidgetProps, CardData} from "./interfaces";
import Application from "./components/Joust";
import GameWidget from "./components/GameWidget";
import GameStateSink from "./state/GameStateSink";
import GameStateTracker from "./state/GameStateTracker";
import HSReplayDecoder from "./protocol/HSReplayDecoder";
import GameStateScrubber from "./state/GameStateScrubber";
import * as http from "http";
import * as stream from "stream"
import * as URL from "url";
import {QueryCardMetadata} from "./interfaces";
import TexturePreloader from "./TexturePreloader";

var React = require('react');
var ReactDOM = require('react-dom');

class Viewer {

	protected target;
	protected opts: GameWidgetProps;
	protected queryCardMetadata: QueryCardMetadata;
	protected ref: GameWidget;

	constructor(target: any) {
		this.target = target;
		this.opts = {
			debug: false
		} as any;
		this.opts.assetDirectory = 'assets/';
	}

	public width(width: number): Viewer {
		this.opts.width = width;
		return this;
	}

	public height(height: number): Viewer {
		this.opts.height = height;
		return this;
	}

	public assets(assets: string): Viewer {
		this.opts.assetDirectory = assets;
		return this;
	}

	public textures(textures: string): Viewer {
		this.opts.textureDirectory = textures;
		return this;
	}

	public metadata(query: QueryCardMetadata): Viewer {
		this.queryCardMetadata = query;
		return this;
	}

	public setOptions(opts: any): Viewer {
		for (var prop in opts) {
			this.opts[prop] = opts[prop];
		}
		return this;
	}

	public debug(enable?: boolean): Viewer {
		if(typeof enable === 'undefined' || enable === null) {
			enable = true;
		}
		this.opts['debug'] = enable;
		return this;
	}

	public fromUrl(url: string): void {
		var decoder = new HSReplayDecoder();
		decoder.debug = this.opts.debug;
		var tracker = new GameStateTracker();
		var scrubber = new GameStateScrubber();
		var sink = new GameStateSink();
		var preloader = new TexturePreloader(this.opts.textureDirectory, this.opts.assetDirectory);

		var opts = URL.parse(url) as any;
		opts.withCredentials = false;
		var request = http.get(opts);
		request.on('response', (response: stream.Readable) => {
			response
				.pipe(decoder) // json -> mutators
				.pipe(tracker) // mutators -> latest gamestate
				.pipe(scrubber) // gamestate -> gamestate emit on scrub past
				.pipe(sink); // gamestate
			if(this.opts.textureDirectory) {
				decoder.pipe(preloader);
			}
		});
		decoder.once('build', (build: number) => {
			if (this.queryCardMetadata) {
				this.queryCardMetadata(build, (cards: CardData[]) => {
					this.ref.setCards(cards);
					if(preloader.canPreload()) {
						preloader.cards = this.ref.state.cards;
						preloader.consume();
					}
				});
			}
		});

		this.opts.sink = sink;
		this.opts.scrubber = scrubber;
		this.opts.cardOracle = decoder;

		this.render();
	}

	protected render(): void {
		this.ref = ReactDOM.render(
			React.createElement(GameWidget, this.opts),
			typeof this.target !== 'string' ? this.target : document.getElementById(this.target)
		);
	}
}

module.exports = {
	renderApplication: (target: string) => {
		ReactDOM.render(
			React.createElement(Application),
			document.getElementById(target)
		);
	},

	renderHSReplay: (target: string, url: string, opts?) => {
		new Viewer(target).setOptions(opts).fromUrl(url);
	},

	viewer: (target) => {
		return new Viewer(target);
	}
}
