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
		if (typeof(Storage) !== "undefined") {
			if (typeof localStorage['rawCards'] === 'string') {
				var result = JSON.parse(localStorage['rawCards']);
				if (typeof result === 'object') {
					console.debug('Using card data from local storage');
					HearthstoneJSON.cards = HearthstoneJSON.parse(result);
					return;
				}
			}
			if(typeof localStorage['rawCards'] !== 'undefined') {
				console.warn('Removing invalid card data in local storage');
				localStorage.removeItem('rawCards');
			}
		}

		getJSON('https://api.hearthstonejson.com/v1/latest/enUS/cards.json', function (error, response) {

			if (error) {
				console.error(error);
				return;
			}

			var cards = HearthstoneJSON.parse(response);
			HearthstoneJSON.cards = cards;

			console.debug('Card definitions loaded from HearthstoneJSON');

			if (typeof(Storage) !== "undefined") {
				localStorage.setItem('rawCards', JSON.stringify(response));
				console.debug('Saved card definitions to local storage');
			}
		})
	}

	private static parse(raw) {
		var cards = Immutable.Map<string, any>();
		var results = raw;

		cards = cards.withMutations(function (map) {
			results.forEach(function (card) {
				map = map.set(card.id, card);
			});
		});
		return cards;
	}
}

export = HearthstoneJSON;