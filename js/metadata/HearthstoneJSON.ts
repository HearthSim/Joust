/// <reference path='../../node_modules/immutable/dist/immutable.d.ts'/>

import Immutable = require('immutable');
import getJSON = require('get-json');

class HearthstoneJSON {
	protected static cards:Immutable.Map<string, any>;

	public static has(id:string) {
		return HearthstoneJSON.cards && HearthstoneJSON.cards.has(id);
	}

	public static get(id:string) {
		return HearthstoneJSON.cards.get(id);
	}

	public static fetch() {
		getJSON('https://api.hearthstonejson.com/v1/latest/enUS/cards.json', function(error, response){

			if(error) {
				console.error(error);
				return;
			}

			var cards = Immutable.Map<string, any>();
			var results = response;

			cards = cards.withMutations(function(map) {
				results.forEach(function(card) {
					map = map.set(card.id, card);
				});
			});

			HearthstoneJSON.cards = cards;
		})
	}
}

export = HearthstoneJSON;