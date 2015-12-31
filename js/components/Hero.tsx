/// <reference path="../../typings/react/react-global.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
'use strict';

import {EntityProps} from "../interfaces";

interface HeroProps extends EntityProps, React.Props<any> {

}

class Hero extends React.Component<HeroProps, {}> {
	public render() {
		return <p>Hero</p>;
	}
}

export = Hero;
