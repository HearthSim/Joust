'use strict';

import Joust = require('./components/Joust');

var renderTo = function (id:string) {
	//var parser = new Joust.Protocol.KettleParser();
	//parser.connect(9111, 'localhost');

	var joust = ReactDOM.render(
		<Joust/>,
		document.getElementById(id)
	);
};

renderTo('container');
