React = require 'react'
Card = require './card'

class Hand extends React.Component
	componentDidMount: ->
		@props.entity.onMulliganStateChanged => @forceUpdate()
		@props.entity.onHandChanged => @forceUpdate()

	render: ->
		return null unless @props.entity.tags.MULLIGAN_STATE is 4

		cards = @props.entity.getHand().map (entity) ->
			<Card entity={entity} key={entity.id} />

		return <div className="hand">
			{cards}
		</div>

module.exports = Hand
