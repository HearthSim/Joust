/// <reference path='../../node_modules/immutable/dist/immutable.d.ts'/>

import Immutable = require('immutable');
import https = require('https');
import URL = require('url');

class HearthstoneJSON {
	protected static cards:Immutable.Map<string, any>;

	public static has(id:string) {
		return HearthstoneJSON.cards && HearthstoneJSON.cards.has(id);
	}

	public static get(id:string) {
		return HearthstoneJSON.cards.get(id);
	}

	public static fetch() {
		if(typeof(Storage) !== "undefined") {
			if (typeof localStorage['rawCards'] === 'string') {
				var result = JSON.parse(localStorage['rawCards']);
				if (typeof result === 'object') {
					console.debug('Using card data from local storage');
					HearthstoneJSON.cards = HearthstoneJSON.parse(result);
					return;
				}
			}
			if (typeof localStorage['rawCards'] !== 'undefined') {
				console.warn('Removing invalid card data in local storage');
				localStorage.removeItem('rawCards');
			}
		}

		var url = URL.parse('https://api.hearthstonejson.com/v1/latest/enUS/cards.json');
		https.get({host: url.host, port: +url.port, path: url.path, protocol: url.protocol}, function (res) {
			if (res.statusCode != 200) {
				console.error('Fetching card data failed with status code ' + res.statusCode);
				return;
			}

			var json = '';
			res.on('data', function (data) {
				json += data;
			});

			res.on('end', function () {
				console.debug('Card definitions received from HearthstoneJSON');
				var data = JSON.parse(json);
				if(typeof data === 'object') {
					var cards = HearthstoneJSON.parse(data);
					HearthstoneJSON.cards = cards;
					console.debug('Card definitions parsed');

					if (typeof(Storage) !== "undefined") {
						localStorage.setItem('rawCards', json);
						console.debug('Saved card definitions to local storage');
					}
				}
				else {
					console.debug('Could not parse card definitions');
				}
			});
		});
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