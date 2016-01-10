'use strict';

import {EventEmitter} from 'events';
import {Socket} from 'net';
import {Client} from '../interfaces';

class WebSocketClient extends EventEmitter implements Client {
	private connection:WebSocket;

	constructor(public url:string) {
		super();
	}

	public connect() {
		this.connection = new WebSocket(this.url, 'binary')
		this.connection.binaryType = 'arraybuffer';
		this.connection.onopen = function () {
			console.debug("Connected to WebSocket");
			this.emit('connect');
		}.bind(this);
		this.connection.onmessage = function (e) {
			this.emit('data', new Buffer(e.data));
		}.bind(this);
		this.connection.onerror = function(err) {
			this.emit('error', err);
		}.bind(this);
		this.connection.onclose = function (err) {
			console.debug("Lost connection");
			this.emit('close');
		}.bind(this);
	}

	public disconnect() {
		this.connection.close();
	}

	public write(buffer:Buffer) {
		this.connection.send(buffer);
	}
}

export = WebSocketClient;