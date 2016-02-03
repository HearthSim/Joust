/// <reference path="../typings/main.d.ts"/>
/// <reference path="./global.d.ts"/>
/// <reference path="../node_modules/immutable/dist/immutable.d.ts"/>

import Application from './components/Joust';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

var renderTo = function (id:string) {
	var joust = ReactDOM.render(
		<Application/>,
		document.getElementById(id)
	);
};

renderTo('container');
