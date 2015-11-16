React = require 'react'

class PlayerName extends React.Component
	render: ->
		cls = 'player-name'
		if @props.position is 'top'
			cls += ' player-name--top'
		else if @props.position is 'bottom'
			cls += ' player-name--bottom'

		return <div className={cls}>
			{@props.entity.name}
		</div>

module.exports = PlayerName
