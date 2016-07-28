import * as React from "react";
import MouseEvent = __React.MouseEvent;
import MouseEventHandler = __React.MouseEventHandler;

interface TooltipperProps extends React.Props<any> {
	title?:string;
	align?:"left" | "center" | "right";
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
		let classNames = ["joust-tooltipper-tooltip"];
		if (this.props.align) {
			classNames.push(this.props.align);
		}
		return <div className="joust-tooltipper"
					onMouseOver={(e) => {this.startHovering(e)}}
					onTouchStart={(e) => {this.startHovering(e)}}
					onMouseOut={(e) => {this.stopHovering(e)}}
					onTouchEnd={(e) => {this.stopHovering(e)}}>
			{this.state.isHovering ? <div className={classNames.join(" ")}><span>{this.props.title}</span></div> : null}
			{this.props.children}
		</div>;
	}

}
