/// <reference path="./typings/browser.d.ts"/>
/// <reference path="./ts/global.d.ts"/>
/// <reference path="./node_modules/immutable/dist/immutable.d.ts"/>

var context = (require as any).context('./ts', true, /\.spec\.tsx?$/);
context.keys().forEach(context);
