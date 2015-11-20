React = require 'react'
{subscribe} = require '../../../../subscription'

class Deck extends React.Component
	componentDidMount: ->
		subscribe @props.entity, 'entity-left-deck entity-entered-deck', =>
			@forceUpdate()

	render: ->
		return <div className="deck">
			{@props.entity.getDeck().length}
		</div>

module.exports = Deck
