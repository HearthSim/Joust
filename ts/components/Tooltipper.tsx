import * as React from "react";
import MouseEvent = __React.MouseEvent;
import MouseEventHandler = __React.MouseEventHandler;

interface TooltipperProps extends React.Props<any> {
	title?:string;
}

interface TooltipperState {
	isHovering?:boolean;
}

export default class Tooltipper extends React.Component<TooltipperProps, TooltipperState> {
	constructor(props:TooltipperProps, context:any) {
		super(props, context);
		this.state = {
			isHovering: false,
		}
	}

	protected startHovering(e) {
		this.setState({isHovering: true});
	}

	protected stopHovering(e) {
		this.setState({isHovering: false});
	}

	render():JSX.Element {
		return <div className="joust-tooltipper"
					onMouseOver={(e) => {this.startHovering(e)}}
					onTouchStart={(e) => {this.startHovering(e)}}
					onMouseOut={(e) => {this.stopHovering(e)}}
					onTouchEnd={(e) => {this.stopHovering(e)}}>
			{this.state.isHovering ? <div className="joust-tooltipper-tooltip">{this.props.title}</div> : null}
			{this.props.children}
		</div>;
	}

}
