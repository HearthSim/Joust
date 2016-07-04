import * as React from "react";
import {CardDataProps} from "../interfaces";

interface LogCardProps extends CardDataProps, React.Props<any> {
	cardId: string;
}

class LogCard extends React.Component<LogCardProps, {}> {

	public shouldComponentUpdate(nextProps:LogCardProps, nextState:any): boolean {
		return (
			this.props.cardId !== nextProps.cardId ||
			this.props.cards !== nextProps.cards
		);
	}

	public render(): JSX.Element {
		let description = 'a card';
		let classNames = ['entity'];
		if(this.props.cards && this.props.cardId && this.props.cards.has(this.props.cardId)) {
			let card = this.props.cards.get(this.props.cardId);
			description = '[' + card.name + ']';
			if(card.type == "HERO" || card.type == "HERO_POWER") {
				classNames.push('special');
			}
			else if(card.rarity) {
				classNames.push(card.rarity.toString().toLowerCase());
			}
		}
		return <span className={classNames.join(' ')}>{description}</span>;
	}
}

export default LogCard;
