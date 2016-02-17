import * as React from "react";

interface TimelineProps extends React.Props<any> {
	at: number;
	duration: number;
}

interface TimelineState {
	isDragging?: boolean;
}

class Timeline extends React.Component<TimelineProps, TimelineState> {
	private ref:HTMLDivElement;
	private mouseMove:(e) => void;
	private mouseUp:(e) => void;
	private lastOffset:number;

	constructor(props:TimelineProps) {
		super(props);
		this.state = {
			isDragging: false
		};
		this.mouseMove = this.onMouseMove.bind(this);
		this.mouseUp = this.onMouseUp.bind(this);
	}

	public componentDidMount():void {
		document.addEventListener('mousemove', this.mouseMove);
		document.addEventListener('mouseup', this.mouseUp);
	}

	public componentWillUnmount():void {
		document.removeEventListener('mousemove', this.mouseMove);
		document.removeEventListener('mouseup', this.mouseUp);
	}

	protected onMouseDown(e):void {
		if (e.button !== 0) {
			// any button other than left click
			return;
		}
		this.setState({isDragging: true});
	}

	protected onMouseMove(e):void {
		if (!this.state.isDragging) {
			return;
		}

		var rect = this.ref.getBoundingClientRect();
		var offset = Math.min(Math.max(rect.left, e.clientX), rect.right);

		if (this.lastOffset === offset) {
			return;
		}

		this.lastOffset = offset;
		//console.log(offset);
	}

	protected onMouseUp(e):void {
		this.setState({isDragging: false});
	}

	public render():JSX.Element {
		return (
			<div className="scrubber-history" ref={(ref) => this.ref = ref} style={{cursor: 'pointer'}}
				 onMouseDown={this.onMouseDown.bind(this)}>
			</div>
		);
	}
}

export default Timeline;
