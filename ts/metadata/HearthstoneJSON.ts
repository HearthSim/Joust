import * as Immutable from "immutable";
import * as https from "https";
import * as URL from "url";
import {EventEmitter} from "events";
import {CardType} from "../enums";
import {CardData} from "../interfaces";

/**
 * Convenience class for fetching card meta data from HearthstoneJSON.com
 */
class HearthstoneJSON extends EventEmitter {

	protected url:string;

	constructor(url:string) {
		super();
		this.url = url;
	}

	/**
	 * Attempts to load the card data, first from localStorage, then from the url.
	 */
	public load():void {
		if (!this.loadFromLocalStorage()) {
			this.loadFromUrl(this.url);
		}
	}

	protected loadFromLocalStorage():boolean {
		if (typeof(Storage) !== "undefined") {
			if (typeof localStorage["rawCards"] === "string") {
				var result = JSON.parse(localStorage["rawCards"]);
				if (typeof result === "object") {
					console.debug("Loaded card data from local storage (" + result.length + " cards)");
					this.parse(result);
					return true;
				}
			}
			if (typeof localStorage["rawCards"] !== "undefined") {
				console.warn("Removing invalid card data in local storage");
				localStorage.removeItem("rawCards");
			}
		}
		return false;
	}

	protected loadFromUrl(url:string):void {
		console.debug("Loading card data from " + url);
		var parsed = URL.parse(url);
		https.get({
			host: parsed.host,
			port: +parsed.port,
			path: parsed.path,
			protocol: parsed.protocol
		}, function (response) {
			if (response.statusCode != 200) {
				console.error("Fetching card data failed with status code " + response.statusCode);
				return false;
			}

			var json = "";
			response.on("data", function (data) {
				json += data;
			});

			response.on("end", function () {
				var data = JSON.parse(json);
				console.debug("Received card data (" + data.length + " cards)");
				if (typeof data === "object") {
					var cards = this.parse(data);

					if (typeof(Storage) !== "undefined") {
						localStorage.setItem("rawCards", json);
						console.debug("Card data saved to local storage");
					}

					return true;
				}
				else {
					console.debug("Could not parse card data");
				}
			}.bind(this));
		}.bind(this));
	}

	protected parse(raw):Immutable.Map<string, CardData> {
		var cards = Immutable.Map<string, CardData>();

		cards = cards.withMutations(function (map) {
			raw.forEach(function (card:CardData) {
				map = map.set(card.id, card);
			});
		});

		this.emit("cards", cards);

		return cards;
	}
}

export default HearthstoneJSON;