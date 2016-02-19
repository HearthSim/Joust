import * as React from "react";

interface TimelineProps extends React.Props<any> {
	at: number;
	duration: number;
	seek:(time:number) => void;
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
		e.preventDefault();
		this.setState({isDragging: true});
		this.seek(e);
	}

	protected onMouseMove(e):void {
		if (!this.state.isDragging) {
			return;
		}

		this.seek(e);
	}

	protected seek(e):void {
		var rect = this.ref.getBoundingClientRect();
		var offset = Math.min(Math.max(rect.left, e.clientX), rect.right);

		if (this.lastOffset === offset) {
			return;
		}

		var width = rect.right - rect.left;
		this.lastOffset = offset;

		offset = offset - rect.left;

		var seek = this.props.duration / width * offset;
		this.props.seek(seek);
	}

	protected onMouseUp(e):void {
		this.setState({isDragging: false});
	}

	public render():JSX.Element {
		var width = this.props.duration > 0 ? 100 / this.props.duration * this.props.at : 0;
		var style = {width: width + '%'};
		if ((width % 100) === 0) {
			style['borderRight'] = 'none';
		}
		return (
			<div className="joust-scrubber-timeline" ref={(ref) => this.ref = ref} style={{cursor: 'pointer'}}
				 onMouseDown={this.onMouseDown.bind(this)}>
				<div className="joust-scrubber-progress" style={style}></div>
			</div>
		);
	}
}

export default Timeline;
