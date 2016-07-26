import * as React from "react";

interface SecretTextProps extends React.Props<any> {
	text: string;
	title?: string;
}

class SecretText extends React.Component<SecretTextProps, {}> {
	public render(): JSX.Element {
		return <div className="secret-text" title={this.props.title}>{this.props.text}</div>;
	}
}

export default SecretText;
