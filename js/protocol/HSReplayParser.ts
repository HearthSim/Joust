/// <reference path="../../typings/sax/sax.d.ts"/>
'use strict';

namespace Joust.Protocol {
	import AddEntityMutator = Joust.State.Mutators.AddEntityMutator;
	import TagChangeMutator = Joust.State.Mutators.TagChangeMutator;
	import ReplaceEntityMutator = Joust.State.Mutators.ReplaceEntityMutator;

	export class HSReplayParser {
		private stream;
		private stateTracker:Joust.State.GameStateTracker;
		private nodeStack = [];
		private timeOffset:number = null;
		private lastTimestamp:number = null;

		constructor(state:Joust.State.GameStateTracker) {
			this.stateTracker = state;
		}

		public parse(file:string) {
			var sax = require('sax').createStream(true);
			sax.on('opentag', this.onOpenTag.bind(this));
			sax.on('closetag', this.onCloseTag.bind(this));
			var fs = require('fs');
			this.stream = fs.createReadStream(file);
			var stream = this.stream.pipe(sax);
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
			switch (node.name) {
				case 'Game':
					this.gameDepth = +this.nodeStack.length + 1;
					break;
				case 'GameEntity':
				case 'Player':
				case 'FullEntity':
				case 'ShowEntity':
					node.attributes.tags = {};
					break
			}

			this.nodeStack.push(node);
			//console.debug(Array(this.nodeStack.length).join('\t') + '<' + node.name + '>');

			var timestamp = node.attributes.ts && this.parseTimestamp(node.attributes.ts) || null;
			if (timestamp !== null) {
				if (this.timeOffset === null) {
					this.timeOffset = timestamp;
				}
				timestamp -= this.timeOffset;
			}

			if (timestamp && (this.nodeStack.length === this.gameDepth + 1)) {
				this.stateTracker.mark(timestamp);
			}
		}

		private onCloseTag(name) {
			//console.debug(Array(this.nodeStack.length).join('\t') + '</' + name + '>');
			var node = this.nodeStack.pop();

			// sanity check for our stack
			if (node.name !== name) {
				console.error("Closing node did not match the opening node from stack");
				return;
			}

			var mutator = null;
			switch (name) {
				case 'Game':
					// we're done here
					this.stateTracker.markGameComplete();
					break;
				case 'GameEntity':
				case 'FullEntity':
					var entity = new Entity(
						+node.attributes.id,
						Immutable.fromJS(node.attributes.tags),
						node.attributes.cardID || null
					);
					mutator = new AddEntityMutator(entity);
					break;
				case 'Player':
					var player = new Player(
						+node.attributes.id,
						Immutable.fromJS(node.attributes.tags),
						+node.attributes.playerID
					);
					mutator = new AddEntityMutator(player);
					break;
					break;
				case 'ShowEntity':
					var state = this.stateTracker.getGameState();
					var entity = state.getEntity(+node.attributes.entity);
					if (!entity) {
						console.error('Cannot show non-existent entity #' + node.attributes.entity);
						return;
					}
					entity = entity.setCardId(node.attributes.cardID || null);
					entity = entity.setTags(Immutable.fromJS(node.attributes.tags));
					mutator = new ReplaceEntityMutator(entity);
					break;
				case 'Tag':
					var parent = this.nodeStack.pop();
					parent.attributes.tags[+node.attributes.tag] = +node.attributes.value;
					this.nodeStack.push(parent);
					break;
				case 'TagChange':
					mutator = new TagChangeMutator(
						+node.attributes.entity,
						+node.attributes.tag,
						+node.attributes.value
					);
					break;
			}

			if (mutator !== null) {
				this.stateTracker.apply(mutator);
			}
		}
	}
}