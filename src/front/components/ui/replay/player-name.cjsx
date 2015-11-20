React = require 'react'

class PlayerName extends React.Component
	render: ->
		return <div className="player-name">
			{@props.entity.name}
		</div>

module.exports = PlayerName
