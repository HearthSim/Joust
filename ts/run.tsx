/// <reference path="../typings/index.d.ts"/>
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
import * as https from "https";
import * as URL from "url";
import {QueryCardMetadata} from "./interfaces";
import TexturePreloader from "./TexturePreloader";

var React = require('react');
var ReactDOM = require('react-dom');

class Launcher {

	protected target;
	protected opts: GameWidgetProps;
	protected queryCardMetadata: QueryCardMetadata;
	protected ref: GameWidget;

	constructor(target: any) {
		this.target = target;
		this.opts = {
			debug: false,
			logger: (error: Error): void => {
				let message = error.message ? error.message : error;
				console.error(message);
			}
		} as any;
		this.opts.assetDirectory = 'assets/';
	}

	public width(width: number): Launcher {
		this.opts.width = width;
		return this;
	}

	public height(height: number): Launcher {
		this.opts.height = height;
		return this;
	}

	public assets(assets: string): Launcher {
		this.opts.assetDirectory = assets;
		return this;
	}

	public textures(a: any): Launcher {
		console.warn('Launcher.textures() is no longer in use, use .cardArt() instead');
		return this;
	}

	public cardArt(url: string): Launcher {
		this.opts.cardArtDirectory = url;
		return this;
	}

	public metadata(query: QueryCardMetadata): Launcher {
		this.queryCardMetadata = query;
		return this;
	}

	public setOptions(opts: any): Launcher {
		for (var prop in opts) {
			this.opts[prop] = opts[prop];
		}
		return this;
	}

	public logger(logger: (message) => void): Launcher {
		this.opts.logger = logger;
		return this;
	}

	public debug(enable?: boolean): Launcher {
		if(typeof enable === 'undefined' || enable === null) {
			enable = true;
		}
		this.opts['debug'] = enable;
		return this;
	}

	protected log(message:any): void {
		this.opts.logger(message);
	}

	public fromUrl(url: string): void {
		var decoder = new HSReplayDecoder();
		decoder.debug = this.opts.debug;
		var tracker = new GameStateTracker();
		var scrubber = new GameStateScrubber();
		var sink = new GameStateSink();
		var preloader = new TexturePreloader(this.opts.cardArtDirectory, this.opts.assetDirectory);
		if(preloader.canPreload()) {
			preloader.consume();
		}

		var opts = URL.parse(url) as any;
		opts.withCredentials = false;
		var request = https.get(opts);
		request.on('response', (response: http.IncomingMessage) => {
			if(response.statusCode != 200) {
				this.log(new Error('Could not load replay ("' + response.statusCode + ' ' + response.statusMessage + '")'));
;				return;
			}

			response
				.pipe(decoder) // json -> mutators
				.pipe(tracker) // mutators -> latest gamestate
				.pipe(scrubber) // gamestate -> gamestate emit on scrub past
				.pipe(sink); // gamestate

			decoder.on('error', this.log.bind(this));

			if(this.opts.cardArtDirectory) {
				decoder.pipe(preloader);
			}
		});
		decoder.once('build', (build: number) => {
			if (this.queryCardMetadata) {
				this.queryCardMetadata(build, (cards: CardData[]) => {
					this.ref.setCards(cards);
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
		new Launcher(target).setOptions(opts).fromUrl(url);
	},

	viewer: (target) => {
		return new Launcher(target);
	}
}
