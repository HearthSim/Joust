import * as React from "react";
import HSReplayDecoder from "../protocol/HSReplayDecoder";
import Websocket from "websocket-stream";
import KettleDecoder from "../protocol/KettleDecoder";
import KettleEncoder from "../protocol/KettleEncoder";
import {InteractiveBackend} from "../interfaces";
import {Socket} from 'net';
import FileReaderStream from 'filereader-stream'
import GameStateScrubber from "../state/GameStateScrubber";
import GameStateTracker from "../state/GameStateTracker";
import GameStateSink from "../state/GameStateSink";

interface SetupWidgetProps extends React.Props<any> {
	defaultHostname:string;
	defaultPort:number;
	onSetup:(sink:GameStateSink, interaction?:InteractiveBackend, scrubber?:GameStateScrubber) => void;
}

interface SetupWidgetState {
	working?:boolean;
	hostname?:string;
	port?:number;
	websocket?:boolean;
	secureWebsocket?:boolean;
}

class SetupWidget extends React.Component<SetupWidgetProps, SetupWidgetState> {
	constructor(props:SetupWidgetProps) {
		super(props);
		this.state = {
			working: false,
			hostname: null,
			port: null,
			websocket: true,
			secureWebsocket: true
		}
	}

	public render():JSX.Element {
		return (
			<div className="setup-widget widget">
				<section>
					<h2>HSReplay</h2>
					<input type="file" accept="application/vnd.hearthsim-hsreplay+xml,application/xml"
						   onChange={this.onSelectFile.bind(this)} disabled={this.state.working}/>
				</section>
				<section>
					<h2>Kettle</h2>
					<form onSubmit={this.onSubmitKettle.bind(this)}>
						<input type="text" placeholder={this.props.defaultHostname}
							   onChange={this.onChangeHostname.bind(this)} disabled={this.state.working}/>
						<input type="number" placeholder={''+this.props.defaultPort}
							   onChange={this.onChangePort.bind(this)}
							   disabled={this.state.working}/>
						<input type="checkbox" checked={this.state.websocket}
							   onChange={this.onChangeWebsocket.bind(this)}/>
						<input type="checkbox" checked={this.state.secureWebsocket}
							   onChange={this.onChangeSecureWebsocket.bind(this)}/>
						<button type="submit" disabled={this.state.working}>Connect</button>
					</form>
				</section>
			</div>
		);
	}

	protected onChangeHostname(e):void {
		this.setState({hostname: e.target.value});
	}

	protected onChangePort(e):void {
		this.setState({port: e.target.value});
	}

	protected onChangeWebsocket(e):void {
		this.setState({websocket: e.target.checked});
	}

	protected onChangeSecureWebsocket(e):void {
		this.setState({secureWebsocket: e.target.checked});
	}


	protected onSelectFile(e):void {
		var file = e.target.files[0];
		if (!file || this.state.working) {
			return;
		}
		this.setState({working: true});
		this.loadFile(file);
	}

	protected loadFile(file:any):void {
		var filestream = FileReaderStream(file);

		/* HSReplay -> Joust */

		var scrubber = new GameStateScrubber();
		var sink = filestream // sink is returned by the last .pipe()
			.pipe(new HSReplayDecoder()) // json -> mutators
			.pipe(new GameStateTracker()) // mutators -> latest gamestate
			.pipe(scrubber) // gamestate -> gamestate emit on scrub past
			.pipe(new GameStateSink()); // gamestate


		this.props.onSetup(sink, null, scrubber);
	}

	protected onSubmitKettle(e):void {
		e.preventDefault();
		if (this.state.working) {
			return;
		}
		this.setState({working: true});

		var hostname = this.state.hostname || this.props.defaultHostname;
		var port = this.state.port || this.props.defaultPort;

		var socket = null;


		if (this.state.websocket) {
			var protocol = this.state.secureWebsocket ? 'wss' : 'ws';
			socket = new Websocket(protocol + '://' + hostname + ':' + port, 'binary');
		}
		else {
			socket = new Socket();
			socket.connect(port, hostname);
		}


		/* Kettle -> Joust */

		var tracker = new GameStateTracker();
		var sink = socket // sink is returned by the last .pipe()
			.pipe(new KettleDecoder()) // json -> mutators
			.pipe(tracker) // mutators -> latest gamestate
			.pipe(new GameStateSink());

		/* Joust -> Kettle */

		var interaction = new KettleEncoder(tracker);
		interaction
			.pipe(socket);

		socket.on('connect', function () {
			interaction.startGame();
			this.props.onSetup(sink, interaction);
		}.bind(this));

		socket.on('error', function (e) {
			console.error(e);
		});

		socket.on('close', function () {
			this.setState({working: false});
			console.log('Connection closed');
		}.bind(this));
	}


}

export default SetupWidget;