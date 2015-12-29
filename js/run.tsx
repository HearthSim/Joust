'use strict';

var renderTo = function (id:string) {
	ReactDOM.render(
		<Joust.Components.Joust/>,
		document.getElementById(id)
	);
};

renderTo('container');