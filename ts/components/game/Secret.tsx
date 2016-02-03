import * as React from "react";
import {EntityProps} from "../../interfaces";
import {CardClass} from "../../enums";

interface SecretProps extends EntityProps, React.Props<any> {

}

class Secret extends React.Component<SecretProps, {}> {

	public render():JSX.Element {
		var entity = this.props.entity;
		var classNames = ["secret"];
		switch (this.props.entity.getClass()) {
			case CardClass.HUNTER:
				classNames.push("hunter");
				break;
			case CardClass.MAGE:
				classNames.push("mage");
				break;
			case CardClass.PALADIN:
				classNames.push("paladin");
				break;
		}
		if (entity.isExhausted()) {
			classNames.push("exhausted");
		}
		return (
			<div className={classNames.join(' ')}>?</div>
		);
	}
}

export default Secret;
