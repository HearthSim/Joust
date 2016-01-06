/// <reference path='../typings/react/react-dom.d.ts'/>
'use strict';

import Application = require('./components/Application');
import React = require('react');
import ReactDOM = require('react-dom');

var renderTo = function (id:string) {
	var joust = ReactDOM.render(
		<Application/>,
		document.getElementById(id)
	);
};

renderTo('container');
