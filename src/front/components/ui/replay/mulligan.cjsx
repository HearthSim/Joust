React = require 'react'
Card = require './card'
_ = require 'lodash'

class Mulligan extends React.Component
	componentDidMount: ->
		@props.entity.onMulliganStateChanged => @forceUpdate()

	render: ->
		return null unless @props.entity.tags.MULLIGAN_STATE < 4

		cards = @props.entity.getHand().slice(0, 4).map (entity) =>
			<Card entity={entity} key={entity.id} />

		return <div className="mulligan">
			{cards}
		</div>

module.exports = Mulligan
