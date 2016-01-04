'use strict';

import React = require('react');

interface KettleProps extends React.Props<any> {
	initializeKettle(hostname:string, port:number):void
}

interface KettleState {
	hostname?:string;
	port?:number;
}

class Kettle extends React.Component<KettleProps, KettleState> {

	constructor() {
		super()
		this.state = {hostname: null, port: null};
	}

	public onChangeHostname(e) {
		this.setState({hostname: e.target.value});
	}

	public onChangePort(e) {
		this.setState({port: +e.target.value});
	}

	public submit(e) {
		e.preventDefault();
		this.props.initializeKettle(this.state.hostname || 'localhost', this.state.port || 9111);
	}

	public render() {
		return (
			<div className="backend kettle">
				<h2>Kettle (Fireplace)</h2>
				<pre>
					git clone&nbsp;
					<a href="https://github.com/jleclanche/fireplace.git" target="_blank">
						https://github.com/jleclanche/fireplace.git
					</a>
				</pre>
				<pre>git checkout fireplace</pre>
				<pre>./kettle/kettle.py &lt;hostname&gt; &lt;port&gt;</pre>
				<form onSubmit={this.submit.bind(this)}>
					<label className="hostname">
						Hostname:
						<input type="text" placeholder="localhost" value={this.state.hostname} onChange={this.onChangeHostname.bind(this)} />
					</label>
					<label className="port">
						Port:
						<input type="number" placeholder="9111" value={''+this.state.port} onChange={this.onChangePort.bind(this)} />
					</label>
					<button type="submit">Connect</button>
				</form>
			</div>
		);
	}
}

export = Kettle;
