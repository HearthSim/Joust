'use strict';

import Entity = Joust.Entity;
import State = Joust.State;

var renderTo = function (id:string) {
	//var parser = new Joust.Protocol.KettleParser();
	//parser.connect(9111, 'localhost');

	var joust = ReactDOM.render(
		<Joust.Components.Joust/>,
		document.getElementById(id)
	);
};

renderTo('container');
