React = require 'react'
Card = require './card'
_ = require 'lodash'

class Board extends React.Component
	componentDidMount: ->
		@props.entity.onBoardChanged =>
			@forceUpdate()

	render: ->
		cards = @props.entity.getBoard().map (entity) ->
			(<Card entity={entity} key={entity.id} stats={true} />)

		return <div className="board">
			{cards}
		</div>

module.exports = Board
