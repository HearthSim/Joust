declare module "filereader-stream" {
	function internal(file?:string, options?:any):any;

	export default internal;
}

declare module "websocket-stream" {
	import * as Stream from "stream";

	class WebSocketStream extends Stream.Duplex {
		constructor(target, protocols?, options?);
	}

	export default WebSocketStream;
}

declare module "react-dnd-html5-backend" {
	// based on https://github.com/Asana/DefinitelyTyped/commit/a167d13b71f8b7dbea6c82dc18fd698b916a2be3
	export enum NativeTypes { FILE, URL, TEXT }
	export function getEmptyImage():any; // Image
	export default class HTML5Backend implements __ReactDnd.Backend {
	}
}

declare module "is-node" {
	var isNode:boolean;
	export default isNode;
}