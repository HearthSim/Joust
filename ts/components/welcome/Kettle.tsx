import * as React from 'react';
import isNode from 'is-node';
import SelectDeck from './SelectDeck';

interface KettleProps extends React.Props<any> {
	callbackTCPSocket(hostname:string, port:number, hero1:string, deck1:string[], hero2:string, deck2:string[]):void
	callbackWebSocket(url:string, hero1:string, deck1:string[], hero2:string, deck2:string[]):void
	connecting:boolean;
}

interface KettleState {
	defaultHostname?:string;
	defaultPort?:number;
	hostname?:string;
	port?:number;
	websocket?:boolean;
	websocketSecure?:boolean;
	hero1?:string;
	deck1?:string[];
	hero2?:string;
	deck2?:string[];
}

class Kettle extends React.Component<KettleProps, KettleState> {

	constructor() {
		super();
		this.state = {
			defaultHostname: isNode ? 'localhost' : document.location.host,
			defaultPort: isNode ? 9111 : 61700,
			hostname: null,
			port: null,
			websocket: !isNode,
			websocketSecure: (document.location.protocol === 'https:'),
			hero1: '',
			deck1: [],
			hero2: '',
			deck2: []
		};
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

	public onChangeSecureWebSocket(e) {
		var checked = e.target.checked;
		this.setState({websocketSecure: checked});
	}

	public onSelectDeck1(hero:string, deck:string[]):void {
		this.setState({hero1: hero, deck1: deck});
	}

	public onSelectDeck2(hero:string, deck:string[]):void {
		this.setState({hero2: hero, deck2: deck});
	}

	public submit(e) {
		e.preventDefault();
		var hostname = this.state.hostname || this.state.defaultHostname;
		var port = this.state.port || this.state.defaultPort;
		if (this.state.websocket) {
			var protocol = (this.state.websocketSecure) ? 'wss:' : ' ws:';
			this.props.callbackWebSocket(protocol + '//' + hostname + ':' + port + '/', this.state.hero1, this.state.deck1, this.state.hero2, this.state.deck2);
		}
		else {
			this.props.callbackTCPSocket(hostname, port, this.state.hero1, this.state.deck1, this.state.hero2, this.state.deck2);
		}
	}

	public render() {
		var repeat = function (array:any[], times:number):any[] {
			var result = array;
			for (var i = 0; i < times; i++) {
				result = result.concat(array)
			}
			return result;
		}
		var decks = [
			{
				name: 'Webspinners',
				hero: 'HERO_05',
				cards: repeat(['FP1_011'], 30)
			},
			{
				name: 'Unstable Portals',
				hero: 'HERO_08',
				cards: repeat(['GVG_003'], 30)
			},
			{
				name: 'Patron Warrior',
				hero: 'HERO_01',
				cards: repeat(
					['EX1_607', 'CS2_108', 'EX1_400', 'CS2_106', 'EX1_392', 'EX1_402', 'EX1_007', 'LOE_022', 'EX1_604', 'FP1_021', 'NEW1_022', 'GVG_096', 'BRM_019']
					, 2).concat(['EX1_391', 'FP1_030', 'GVG_110', 'EX1_414'])
			},
			{
				name: 'Secret Paladin',
				hero: 'HERO_04',
				cards: repeat(
					['FP1_020', 'EX1_130', 'EX1_080', 'FP1_002', 'NEW1_019', 'GVG_058', 'GVG_061', 'CS2_092', 'GVG_096', 'FP1_012', 'AT_079']
					, 2).concat(['AT_073', 'EX1_136', 'GVG_059', 'CS2_097', 'LOE_017', 'GVG_110', 'EX1_298', 'EX1_383'])
			},
			{
				name: 'RenoLock',
				hero: 'HERO_07',
				cards: [
					'EX1_302', 'FP1_001', 'GVG_015', 'EX1_066', 'LOE_023', 'CS2_203', 'EX1_058', 'BRM_005', 'EX1_005', 'LOE_077',
					'CS2_117', 'BRM_006', 'CS2_062', 'GVG_045', 'EX1_303', 'EX1_093', 'GVG_096', 'EX1_043', 'FP1_022', 'GVG_069',
					'EX1_310', 'FP1_030', 'FP1_012', 'BRM_028', 'LOE_011', 'EX1_016', 'GVG_110', 'EX1_323', 'GVG_021', 'EX1_620'
				]
			}
		];
		return (
			<div className="backend kettle">
				<h2>Kettle (Fireplace)</h2>
				<p>
					Joust can be used as a Kettle client to play Hearthstone in your browser.
				</p>
				<p>
					Fireplace is the simulator behind Kettle and makes sure the game behaves just as you'd expect.
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
							   onChange={this.onChangeHostname.bind(this)} disabled={this.props.connecting}/>
					</label>
					<label className="port">
						Port:
						<input type="number" placeholder={''+this.state.defaultPort} value={''+this.state.port}
							   onChange={this.onChangePort.bind(this)} disabled={this.props.connecting}/>
					</label>
					<div className="websocket">
						<label>
							<input type="checkbox" checked={this.state.websocket}
								   disabled={!isNode || this.props.connecting}
								   onChange={this.onChangeWebSocket.bind(this)}/>
							WebSocket
						</label>
						<label>
							<input type="checkbox" checked={this.state.websocketSecure}
								   disabled={this.props.connecting || !this.state.websocket}
								   onChange={this.onChangeSecureWebSocket.bind(this)}/>
							Secure
						</label>
					</div>
					<button type="submit"
							disabled={this.props.connecting}>{this.props.connecting && 'Connecting...' || 'Connect'}</button>
					<h3>Options:</h3>
					<div className="decks">
						<label>Deck 1:
							<SelectDeck presets={decks} default={0} disabled={this.props.connecting}
										onSelect={this.onSelectDeck1.bind(this)}/>
						</label>
						<label>Deck 2:
							<SelectDeck presets={decks} default={1} disabled={this.props.connecting}
										onSelect={this.onSelectDeck2.bind(this)}/>
						</label>
					</div>
				</form>
			</div>
		);
	}
}

export default Kettle;
