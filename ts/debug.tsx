import * as React from "react";
import * as path from "path";
import * as ReactDOM from "react-dom";
import * as electron from "electron";
import DebugApplication from "./components/DebugApplication";
export * from "./run";

const { process } = electron.remote;

export function renderApplication(target: string) {
	// electron argv follows bash/c++ ones [electronpath, arg1 ("." in our case), <optionalreplayname>]
	const replayName = process.argv.length > 2 ? process.argv[2] : null;
	ReactDOM.render(
		<DebugApplication replay={replayName} />,
		document.getElementById(target)
	);
}
