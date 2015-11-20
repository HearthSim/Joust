React = require 'react'
Card = require './card'
_ = require 'lodash'
{subscribe} = require '../../../../subscription'

class Mulligan extends React.Component
	componentDidMount: ->
		@sub = subscribe @props.entity, 'tag-changed:MULLIGAN_STATE', ({newValue}) =>
			@forceUpdate()

	componentWillUnmount: ->
		@sub.off()

	render: ->
		return null unless @props.entity.tags.MULLIGAN_STATE < 4

		cards = @props.entity.getHand().slice(0, 4).map (entity) =>
			<Card entity={entity} key={entity.id} />

		return <div className="mulligan">
			{cards}
		</div>

module.exports = Mulligan
