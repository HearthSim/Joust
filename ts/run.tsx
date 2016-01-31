/// <reference path='global.d.ts'/>
/// <reference path='../typings/react/react-dom.d.ts'/>

import Application from './components/Application';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

var renderTo = function (id:string) {
	var joust = ReactDOM.render(
		<Application/>,
		document.getElementById(id)
	);
};

renderTo('container');
