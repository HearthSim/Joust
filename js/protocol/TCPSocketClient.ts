'use strict';

import {EventEmitter} from 'events';
import {Socket} from "net";
import {Client} from "../interfaces";

class TCPSocketClient extends EventEmitter implements Client {
	private socket:Socket;

	constructor(public hostname:string, public port:number) {
		super();
	}

	public connect() {
		this.socket = new Socket();
		// we don't use set_encoding to parse the length
		this.socket.once('connect', function () {
			console.debug("Connected to socket");
			this.socket.on('data', function (data) {
				this.emit('data', data);
			}.bind(this));
			this.socket.once('close', function () {
				console.debug("Lost connection");
				this.emit('close');
			}.bind(this));
			this.emit('connect');
		}.bind(this));
		this.socket.connect(this.port, this.hostname);
	}

	public disconnect() {
		this.socket.end();
	}

	public write(buffer:Buffer) {
		this.socket.write(buffer);
	}
}

export = TCPSocketClient;