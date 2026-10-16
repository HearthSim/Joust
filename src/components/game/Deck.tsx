import * as React from "react";
import EntityList from "./EntityList";
import { EntityListProps } from "../../interfaces";

interface DeckProps extends EntityListProps {
	fatigue: number;
	hideFatigue?: boolean;
}

export default class Deck extends EntityList<DeckProps> {
	protected className(): string {
		return "deck";
	}

	public render(): JSX.Element {
		const { entities, fatigue, hideFatigue } = this.props;
		const deckSize = entities.size;
		if (hideFatigue && !deckSize) {
			return (
				<div
					className={this.className()}
					style={{ visibility: "hidden" }}
				/>
			);
		}
		let tooltip = null;
		const classNames = [this.className()];
		switch (deckSize) {
			case 0:
				tooltip = fatigue + " damage dealt by next card draw";
				classNames.push("fatigue");
				break;
			case 1:
				tooltip = "1 card remaining";
				break;
			default:
				tooltip = deckSize + " cards remaining";
				break;
		}
		return (
			<div className={classNames.join(" ")} title={tooltip}>
				<figure>
					<img
						src={this.props.assetDirectory("images/cardback.png")}
					/>
					<figcaption>
						{this.props.entities.size || -this.props.fatigue}
					</figcaption>
				</figure>
			</div>
		);
	}

	public shouldComponentUpdate(nextProps: DeckProps, nextState) {
		return (
			this.props.fatigue !== nextProps.fatigue ||
			super.shouldComponentUpdate(nextProps, nextState)
		);
	}
}
