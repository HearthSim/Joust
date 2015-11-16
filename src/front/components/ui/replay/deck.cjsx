React = require 'react'

class Deck extends React.Component
	componentDidMount: ->
		@props.entity.onDeckChanged =>
			@forceUpdate()

	render: ->
		return <div className="deck">
			{@props.entity.getDeck().length}
		</div>

module.exports = Deck
