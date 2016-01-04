/// <reference path="../../typings/sax/sax.d.ts"/>
'use strict';

import Immutable = require('immutable');
import Sax = require('sax');
import {ReadStream} from "fs";
import Player = require('../Player');
import Entity = require('../Entity');
import AddEntityMutator = require('../state/mutators/AddEntityMutator');
import TagChangeMutator = require('../state/mutators/TagChangeMutator');
import ReplaceEntityMutator = require('../state/mutators/ReplaceEntityMutator');
import SetOptionsMutator = require('../state/mutators/SetOptionsMutator');
import ClearOptionsMutator = require('../state/mutators/ClearOptionsMutator');
import Option = require('../Option');
import {GameStateManager} from "../interfaces";
import {Readable} from 'stream';
import {createReadStream} from 'fs';

class HSReplayDecoder {
	private stream:ReadStream;
	private nodeStack = [];
	private timeOffset:number = null;
	private complete:number = 0;

	constructor(public manager:GameStateManager) {
	}

	public parseFromStream(stream:Readable):void {
		var sax = Sax.createStream(true, {});
		sax.on('opentag', this.onOpenTag.bind(this));
		sax.on('closetag', this.onCloseTag.bind(this));
		stream.pipe(sax);
	}

	public parseFromFile(file:string):void {
		this.parseFromStream(createReadStream(file));
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

		var timestamp = node.attributes.ts && this.parseTimestamp(node.attributes.ts) || null;
		if (timestamp !== null) {
			if (this.timeOffset === null) {
				this.timeOffset = timestamp;
			}
			timestamp -= this.timeOffset;
		}

		if (timestamp/* && (this.nodeStack.length === this.gameDepth + 1)*/) {
			this.manager.mark(timestamp);
		}
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
				this.manager.setComplete(true);
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
				var state = this.manager.getGameState();
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
			this.manager.apply(mutator);
		}
	}
}

export = HSReplayDecoder;