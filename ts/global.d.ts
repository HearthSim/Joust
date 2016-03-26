/**
 * Global defintions and extensions
 *
 * This file contains module definitions for definition-less modules
 * we're using in TypeScript. Some definitions extend existing ones,
 * where there is either a parameter missing or an incorrect typing.
 *
 */

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

declare module "http" {
	// overwrite withCredentials which is respected by the browser versions
	// this is apparently merged by tsc with the node.d.ts definition: ugly, but it works
	// see https://github.com/substack/http-browserify/pull/53
	export interface RequestOptions {
		withCredentials: boolean;
	}
}

declare module "fullscreen" {
	import {EventEmitter} from "events";

	class fullscreen extends EventEmitter {
		constructor(any:any);

		request():void;

		release():void;

		dispose():void;

		static available():boolean;
	}

	export default fullscreen;
}

declare module "react-dimensions" {
	function Dimensions():any;

	export default Dimensions;
}
