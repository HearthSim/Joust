import * as React from "react";
import {StreamScrubber} from "../interfaces";
import Timeline from "./Timeline";
import * as _ from "lodash";

interface SpeedSelectorProps extends React.Props<any> {
	speed: number;
	speeds: number[];
	selectSpeed: (speed: number) => void;
	disabled?: boolean;
}

class SpeedSelector extends React.Component<SpeedSelectorProps, {}> {

	protected changeSpeed(e): void {
		this.props.selectSpeed(+e.target.value);
	}

	public shouldComponentUpdate(nextProps: SpeedSelectorProps, nextState: any): boolean {
		return nextProps.speed !== this.props.speed ||
			_.isEqual(nextProps.speeds, this.props.speed) ||
			nextProps.selectSpeed !== this.props.selectSpeed ||
			nextProps.disabled !== this.props.disabled
	}

	public render(): JSX.Element {
		var speeds = this.props.speeds.map(function(val) {
			return <option key={val} value={'' + val}>{val}&times; </option>;
		}.bind(this));

		return (
			<select onChange={this.changeSpeed.bind(this) } value={'' + this.props.speed}
				disabled={this.props.disabled} title="Playback speed">
				{speeds}
			</select>
		);

	}
}

export default SpeedSelector;
