/// <reference path="./typings/index.d.ts"/>
/// <reference path="./ts/global.d.ts"/>

const context = (require as any).context("./ts", true, /\.spec\.tsx?$/);
context.keys().forEach(context);
