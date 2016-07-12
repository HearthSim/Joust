import * as React from "react";

interface MessagePickerProps extends React.Props<any> {
	messages: string[];
	interval: number;
	random?: boolean;
}

interface MessagePickerState {
	message?: number;
	sequence?: number[];
}

class MessagePicker extends React.Component<MessagePickerProps, MessagePickerState> {

	private interval: number;

	public constructor(props: MessagePickerProps) {
		super(props);
		this.state = {
			message: 0,
			sequence: this.generateSequence()
		};
	}

	public componentDidMount(): void {
		this.scheduleUpdates();
	}

	public componentWillReceiveProps(nextProps: MessagePickerProps): void {
		if(nextProps.messages.length != this.props.messages.length) {
			clearInterval(this.interval);
			this.setState({message: 0, sequence: this.generateSequence()});
			this.scheduleUpdates();
		}
	}

	public componentWillUnmount():void {
		if(this.interval) {
			clearInterval(this.interval);
		}
	}

	private scheduleUpdates() {
		this.interval = setInterval(this.cycleMessage.bind(this), this.props.interval * 1000);
	}

	public render(): JSX.Element {
		let message = this.props.messages[this.state.sequence[this.state.message]];
		message = message.replace('...', String.fromCharCode(8230)); // &hellip;
		return <span>{message}</span>;
	}

	private generateSequence(): number[] {
		var sequence = [];
		for (let i = 0; i < this.props.messages.length; i++) {
			sequence[i] = i;
		}
		if (this.props.random !== false) {
			sequence = sequence.sort(() => {return 0.5 - Math.random()});
		}
		return sequence;
	}

	private cycleMessage(): void {
		this.setState({message: (this.state.message + 1) % this.props.messages.length});
	}
}

export default MessagePicker;
