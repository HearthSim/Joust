/// <reference path="../../typings/react/react-global.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
'use strict';

import {EntityProps} from "../interfaces";

interface HeroPowerProps extends EntityProps, React.Props<any> {

}

class HeroPower extends React.Component<HeroPowerProps, {}> {
	public render() {
		return <p>HeroPower</p>;
	}
}

export = HeroPower;