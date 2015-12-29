/// <reference path="../../typings/react/react-global.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
'use strict';

namespace Joust.Components {

	export class EndTurnButton extends React.Component<{}, {}> {
		public render() {
			return (
				<button disabled={true}>End Turn</button>
			);
		}
	}

}