/// <reference path='../typings/react/react-dom.d.ts'/>
'use strict';

import Joust = require('./components/Joust');
import React = require('react');
import ReactDOM = require('react-dom');

var renderTo = function (id:string) {
	//var parser = new Joust.Protocol.KettleParser();
	//parser.connect(9111, 'localhost');

	var joust = ReactDOM.render(
		<Joust/>,
		document.getElementById(id)
	);
};

renderTo('container');
