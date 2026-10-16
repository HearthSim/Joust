import * as React from "react";
import * as ReactDOM from "react-dom";
import { process } from "@electron/remote";
import DebugApplication from "./components/DebugApplication";
export * from "./run";

export function renderApplication(target: string) {
	// electron argv follows bash/c++ ones [electronpath, arg1 ("." in our case), <optionalreplayname>]
	const replayName = process.argv.length > 2 ? process.argv[2] : null;
	ReactDOM.render(
		<DebugApplication replay={replayName} /> as any,
		document.getElementById(target),
	);
}
