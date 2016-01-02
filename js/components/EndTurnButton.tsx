/// <reference path="../../typings/react/react-global.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
'use strict';

class EndTurnButton extends React.Component<{}, {}> {
	public render() {
		return (
			<button disabled={true} className="endTurnButton">End Turn</button>
		);
	}
}

export = EndTurnButton;