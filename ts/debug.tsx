/// <reference path="../typings/index.d.ts"/>
/// <reference path="./global.d.ts"/>

import * as React from "react";
import * as ReactDOM from "react-dom";
import DebugApplication from "./components/DebugApplication";
import * as run from "./run.ts";

module.exports = run;
module.exports.renderApplication = (target:string) => {
	ReactDOM.render(
		<DebugApplication />,
		document.getElementById(target)
	);
};
