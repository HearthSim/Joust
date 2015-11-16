React = require 'react'

class Mana extends React.Component
	componentDidMount: ->
		@props.entity.onManaChanged =>
			@forceUpdate()

	render: ->
		return <div className="mana">
			{@props.entity.tags.RESOURCES_USED} / {@props.entity.tags.RESOURCES}
		</div>

module.exports = Mana
