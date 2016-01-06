'use strict';

import React = require('react');

interface SelectDeckProps extends React.Props<any> {
	onSelect(hero:string, deck:string[]):void;
	default:number;
	disabled:boolean;
	presets;
}

interface SelectDeckState {
}

class SelectDeck extends React.Component<SelectDeckProps, SelectDeckState> {

	public componentDidMount() {
		this.selectPreset(this.props.default || 0);
	}

	public selectPreset(index:number) {
		var deck = this.props.presets[index];
		this.props.onSelect(deck.hero, deck.cards);
	}

	public onChange(e) {
		this.selectPreset(+e.target.value);
	}

	public render() {
		var options = [];
		for(var i in this.props.presets) {
			var deck = this.props.presets[i];
			options.push(<option key={i} value={i}>{deck.name}</option>);
		}
		return (
			<select disabled={this.props.disabled} onChange={this.onChange.bind(this)} defaultValue={''+this.props.default}>
				{options}
			</select>
		)
	}
}

export = SelectDeck;