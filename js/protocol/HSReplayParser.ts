/// <reference path="../../typings/sax/sax.d.ts"/>
'use strict';

import Sax = require('sax');
import {ReadStream} from "fs";
import Player = require('../Player');
import Entity = require('../Entity');
import GameStateTracker = require('../state/GameStateTracker');
import AddEntityMutator = require('../state/mutators/AddEntityMutator');
import TagChangeMutator = require('../state/mutators/TagChangeMutator');
import ReplaceEntityMutator = require('../state/mutators/ReplaceEntityMutator');
import SetOptionsMutator = require('../state/mutators/SetOptionsMutator');
import ClearOptionsMutator = require('../state/mutators/ClearOptionsMutator');
import Option = require('../Option');

class HSReplayParser {
	private stream:ReadStream;
	private stateTracker:GameStateTracker;
	private nodeStack = [];
	private timeOffset:number = null;
	private lastTimestamp:number = null;
	private complete:number = 0;

	constructor(state:GameStateTracker) {
		this.stateTracker = state;
	}

	public parse(file:string) {
		var sax = Sax.createStream(true, {});
		sax.on('opentag', this.onOpenTag.bind(this));
		sax.on('closetag', this.onCloseTag.bind(this));
		var fs = require('fs');
		this.stream = fs.createReadStream(file);
		this.stream.pipe(sax);
	}

	protected parseTimestamp(timestamp:string):number {
		if (timestamp.match(/^\d{2}:\d{2}:\d{2}/)) {
			// prepend a date
			timestamp = '1970-01-01 ' + timestamp;
		}
		return new Date(timestamp).getTime();
	}

	private gameDepth:number = null;

	private onOpenTag(node) {
		if (this.complete === 2) {
			return;
		}
		switch (node.name) {
			case 'Game':
				if (this.complete != 0) {
					console.warn('Replay contains more than one game, ignoring');
					this.complete = 2;
					this.stream.close();
					return;
				}
				this.gameDepth = +this.nodeStack.length + 1;
				break;
			case 'GameEntity':
			case 'Player':
			case 'FullEntity':
			case 'ShowEntity':
				node.attributes.tags = Immutable.Map<string, number>();
				break;
			case 'Options':
				node.attributes.options = Immutable.Map<string, Option>();
				break;
			case 'HSReplay':
				var version = node.attributes.version;
				if (version) {
					if (version != '1.0') {
						console.warn('Unsupported HSReplay version', version, '(expected 1.0)');
					}
				}
				else {
					console.warn('Replay does not contain HSReplay version');
				}
				var build = node.attributes.build;
				if (!build) {
					console.warn('Replay does not contain Hearthstone build number');
				}
				break;
		}

		this.nodeStack.push(node);
	}

	private onCloseTag(name) {
		if (this.complete === 2) {
			return;
		}

		//console.debug(Array(this.nodeStack.length).join('\t') + '</' + name + '>');
		var node = this.nodeStack.pop();

		// sanity check for our stack
		if (node.name !== name) {
			console.error('Closing node did not match the opening node from stack');
			return;
		}

		var mutator = null;
		switch (name) {
			case 'Game':
				// we're done here
				this.stateTracker.markGameComplete();
				this.complete = 1;
				break;
			case 'GameEntity':
			case 'FullEntity':
				var entity = new Entity(
					+node.attributes.id,
					node.attributes.tags,
					node.attributes.cardID || null
				);
				mutator = new AddEntityMutator(entity);
				break;
			case 'Player':
				var player = new Player(
					+node.attributes.id,
					node.attributes.tags,
					+node.attributes.playerID,
					node.attributes.name
				);
				mutator = new AddEntityMutator(player);
				break;
			case 'ShowEntity':
				var state = this.stateTracker.getGameState();
				var entity = state.getEntity(+node.attributes.entity);
				if (!entity) {
					console.error('Cannot show non-existent entity #' + node.attributes.entity);
					return;
				}
				entity = entity.setCardId(node.attributes.cardID || null);
				entity = entity.setTags(node.attributes.tags);
				mutator = new ReplaceEntityMutator(entity);
				break;
			case 'HideEntity':
				mutator = new TagChangeMutator(
					+node.attributes.entity,
					'49', // zone
					+node.attributes.zone
				);
				break;
			case 'Tag':
				var parent = this.nodeStack.pop();
				parent.attributes.tags = parent.attributes.tags.set('' + node.attributes.tag, +node.attributes.value);
				this.nodeStack.push(parent);
				break;
			case 'TagChange':
				mutator = new TagChangeMutator(
					+node.attributes.entity,
					'' + node.attributes.tag,
					+node.attributes.value
				);
				break;
			case 'Option':
				var parent = this.nodeStack.pop();
				var option = new Option(
					+node.attributes.index,
					+node.attributes.type,
					+node.attributes.entity || null,
					[] // todo: parse targets
				);
				parent.attributes.options = parent.attributes.options.set('' + node.attributes.index, option);
				this.nodeStack.push(parent);
				break;
			case 'Options':
				mutator = new SetOptionsMutator(node.attributes.options);
				break;
			case 'SendOption':
				mutator = new ClearOptionsMutator();
				break;
		}

		if (mutator !== null) {
			this.stateTracker.apply(mutator);
		}

		//console.debug(Array(this.nodeStack.length).join('\t') + '<' + node.name + '>');

		var timestamp = node.attributes.ts && this.parseTimestamp(node.attributes.ts) || null;
		if (timestamp !== null) {
			if (this.timeOffset === null) {
				this.timeOffset = timestamp;
			}
			timestamp -= this.timeOffset;
		}

		if (timestamp/* && (this.nodeStack.length === this.gameDepth + 1)*/) {
			this.stateTracker.mark(timestamp);
		}
	}
}

export = HSReplayParser;