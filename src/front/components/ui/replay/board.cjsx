React = require 'react'
Card = require './card'
_ = require 'lodash'
SubscriptionList = require '../../../../subscription-list'

class Board extends React.Component
	componentDidMount: ->
		@subs = new SubscriptionList

		@subs.add @props.entity, 'entity-entered-play', ({entity}) =>
			entitySub = @subs.add entity, 'left-play', =>
				entitySub.off()
				@forceUpdate()

			@forceUpdate()

	render: ->
		cards = @props.entity.getBoard().map (entity) ->
			(<Card entity={entity} key={entity.id} stats={true} />)
		return <div className="board">
			{cards}
		</div>

module.exports = Board
