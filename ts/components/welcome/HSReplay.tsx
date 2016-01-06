'use strict';

import React = require('react');
import FileReaderStream = require('filereader-stream')

interface HSReplayProps extends React.Props<any> {
	callback(stream):void
}

interface HSReplayState {
	dragging:boolean;
}

class HSReplay extends React.Component<HSReplayProps, HSReplayState> {

	constructor() {
		super();
		this.state = {dragging: false};
	}

	public onDragOver(e) {
		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';
	}

	public onDragEnter(e) {
		e.stopPropagation();
		e.preventDefault();
		this.setState({dragging: true});
	}

	public onDragLeave(e) {
		e.stopPropagation();
		e.preventDefault();
		this.setState({dragging: false});
	}

	public onDrop(e) {
		e.stopPropagation();
		e.preventDefault();
		this.setState({dragging: false});
		var file = e.dataTransfer.files[0];
		if (file) {
			this.loadFile(file);
		}
	}

	public onSelect(e) {
		var file = e.target.files[0];
		if (file) {
			this.loadFile(file);
		}
	}

	public loadFile(fileName) {
		this.props.callback(FileReaderStream(fileName));
	}

	public render() {
		var classNames = ['dropzone'];
		if (this.state.dragging) {
			classNames.push('droppable');
		}
		return (
			<div className="backend hsreplay">
				<h2>HSReplay</h2>
				<p>
					Joust can replay Hearthstone matches from <code>.hsreplay</code> files.
				</p>
				<p>
					You can generate your own <code>.hsreplay</code> files by <a href="https://github.com/jleclanche/fireplace/wiki/How-to-enable-logging" target="_blank"> enabling logging</a> and running one of the converters from <a href="https://github.com/hearthsim/hsreplay" target="_blank">hearthsim/hsreplay</a>.
				</p>
				<p>
					<a href="https://github.com/Epix37/Hearthstone-Deck-Tracker/" target="_blank">Hearthstone Deck Tracker</a> will start converting your games automatically soon.
				</p>
				<div className={classNames.join(' ')} onDrop={this.onDrop.bind(this)}
					 onDragOver={this.onDragOver.bind(this)}
					 onDragEnter={this.onDragEnter.bind(this)} onDragLeave={this.onDragLeave.bind(this)}>
					<pre>.hsreplay, .xml</pre>
					<p>
						Drop your replay file here
					</p>
				</div>
				<p>
				<small>&hellip;or</small>&nbsp;
				<input type="file" accept="application/vnd.hearthsim-hsreplay+xml,application/xml"
					   onChange={this.onSelect.bind(this)}/>
				</p>
			</div>
		);
	}
}

export = HSReplay;
