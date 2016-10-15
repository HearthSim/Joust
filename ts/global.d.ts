/**
 * Global defintions and extensions
 *
 * This file contains module definitions for definition-less modules
 * we're using in TypeScript. Some definitions extend existing ones,
 * where there is either a parameter missing or an incorrect typing.
 *
 */

declare let JOUST_RELEASE: string;

declare interface Screen extends EventTarget {
	orientation;
}

declare module "filereader-stream" {
	function internal(file?: string, options?: any): any;

	export default internal;
}

declare module "websocket-stream" {
	import * as Stream from "stream";

	class WebSocketStream extends Stream.Duplex {
		constructor(target, protocols?, options?);
	}

	export default WebSocketStream;
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
		constructor(any: any);

		request(): void;

		release(): void;

		dispose(): void;

		static available(): boolean;

		static enabled(): boolean;
	}

	export default fullscreen;
}

declare module "react-dimensions" {
	function Dimensions(): any;

	export default Dimensions;
}

declare module "cookie_js" {
	import * as cookiejs from "cookiejs";
	export {cookiejs as cookie};
}

declare module "byline" {
	import * as Stream from "stream";

	export function createStream(stream?): Stream.Duplex;
}
