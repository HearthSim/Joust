React = require 'react'
{subscribe} = require '../../../../subscription'

class Mana extends React.Component
	componentDidMount: ->
		subscribe @props.entity, 'tag-changed:RESOURCES tag-changed:RESOURCES_USED', =>
			@forceUpdate()

	render: ->
		return <div className="mana">
			{@props.entity.tags.RESOURCES_USED or 0} / {@props.entity.tags.RESOURCES or 0}
		</div>

module.exports = Mana
