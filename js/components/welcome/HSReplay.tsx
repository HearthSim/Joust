'use strict';

import React = require('react');

class HSReplay extends React.Component<{}, {}> {

	public onDrop(e) {
		console.log(e);
	}

	public onDragOver(e) {
		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';
	}

	public selectFile(e) {
		e.preventDefault();

	}

	public render() {
		return (
			<div className="backend hsreplay">
				<h2>HSReplay</h2>
				<p>
					You can generate your own <code>.hsreplay</code> files by&nbsp;
					<a href="https://github.com/jleclanche/fireplace/wiki/How-to-enable-logging" target="_blank">enabling logging</a>&nbsp;
					and running one of the converters from&nbsp;
					<a href="https://github.com/hearthsim/hsreplay" target="_blank">hearthsim/hsreplay</a>.
				</p>
				<p>
					<a href="https://github.com/Epix37/Hearthstone-Deck-Tracker/" target="_blank">
						Hearthstone Deck Tracker
					</a> will start converting your games automatically soon.
				</p>
				<div className="dropzone" onDrop={this.onDrop} onDragOver={this.onDragOver}>
					<pre>.hsreplay, .xml</pre>
					<p>
						Drop your replay file here,<br/>
						<small>or</small><br />
						<input type="file" accept="application/vnd.hearthsim-hsreplay+xml,application/xml" />
					</p>
				</div>
			</div>
		);
	}
}

export = HSReplay;
