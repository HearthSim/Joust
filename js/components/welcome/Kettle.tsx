'use strict';

import React = require('react');
import isNode = require('is-node');

interface KettleProps extends React.Props<any> {
	callbackTCPSocket(hostname:string, port:number):void
	callbackWebSocket(url:string):void
}

interface KettleState {
	defaultHostname?:string;
	defaultPort?:number;
	hostname?:string;
	port?:number;
	websocket?:boolean;
}

class Kettle extends React.Component<KettleProps, KettleState> {

	constructor() {
		super();
		this.state = {
			defaultHostname: isNode ? 'localhost' : 'beheh.de',
			defaultPort: isNode ? 9111 : 61700,
			hostname: null,
			port: null,
			websocket: !isNode};
	}

	public onChangeHostname(e) {
		this.setState({hostname: e.target.value});
	}

	public onChangePort(e) {
		this.setState({port: +e.target.value});
	}

	public onChangeWebSocket(e) {
		var checked = e.target.checked;
		this.setState({websocket: checked});
	}

	public submit(e) {
		e.preventDefault();
		var hostname = this.state.hostname || this.state.defaultHostname;
		var port = this.state.port || this.state.defaultPort;
		if (this.state.websocket) {
			var protocol = (document.location.protocol === 'https:') ? 'wss:' :' ws:';
			this.props.callbackWebSocket(protocol+'//' + hostname + ':' + port + '/');
		}
		else {
			this.props.callbackTCPSocket(hostname, port);
		}
	}

	public render() {
		return (
			<div className="backend kettle">
				<h2>Kettle (Fireplace)</h2>
				<p>
					Joust can be used as a Kettle client to play Hearthstone in your browser.
				</p>
				<p>
					Fireplace is the simulator behind Kettle and makes sure the game behaves just as you expect.
				</p>
				<pre>
					git clone&nbsp;
					<a href="https://github.com/jleclanche/fireplace.git" target="_blank">
						https://github.com/jleclanche/fireplace.git
					</a>
				</pre>
				<pre>git checkout fireplace</pre>
				<pre>./kettle/kettle.py [hostname] [port]</pre>
				<form onSubmit={this.submit.bind(this)}>
					<label className="hostname">
						Hostname:
						<input type="text" placeholder={this.state.defaultHostname} value={this.state.hostname}
							   onChange={this.onChangeHostname.bind(this)}/>
					</label>
					<label className="port">
						Port:
						<input type="number" placeholder={''+this.state.defaultPort} value={''+this.state.port}
							   onChange={this.onChangePort.bind(this)}/>
					</label>
					<label className="websocket">
						<input type="checkbox" checked={this.state.websocket} disabled={!isNode}
							   onChange={this.onChangeWebSocket.bind(this)}/>
						WebSocket
					</label>
					<button type="submit">Connect</button>
				</form>
			</div>
		);
	}
}

export = Kettle;
