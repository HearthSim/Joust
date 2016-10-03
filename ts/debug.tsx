/// <reference path="../typings/index.d.ts"/>
/// <reference path="./global.d.ts"/>

import * as React from "react";
import * as ReactDOM from "react-dom";
import Application from "./components/Joust";

module.exports = {

	renderApplication: (target:string) => {
		ReactDOM.render(
			<Application />,
			document.getElementById(target)
		);
	},
}
