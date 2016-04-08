import * as React from "react";

interface SecretTextProps extends React.Props<any> {
	text: string;
}

class SecretText extends React.Component<SecretTextProps, {}> {
	public render(): JSX.Element {
		return <div className="secret-text">{this.props.text}</div>;
	}
}

export default SecretText;
