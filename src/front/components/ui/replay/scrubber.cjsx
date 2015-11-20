React = require 'react'

class Scrubber extends React.Component
	componentDidMount: ->
		@int = setInterval((=> @forceUpdate()), 500)

	componentWillUnmount: ->
		clearInterval(@int)

	render: ->
		return null unless @props.replay.started

		replay = @props.replay

		length = replay.getTotalLength()
		position = replay.getElapsed()

		handleStyle =
			width: ((position / length) * 100) + '%'

		points = []

		for point, i in replay.getTimestamps()
			pointStyle =
				left: ((point / length) * 100) + '%'

			points.push <div className="scrubber__point" style={pointStyle} key={i} />

		remaining = Math.floor(length - position)
		remainingSeconds = ""+(remaining % 60)
		if remainingSeconds.length < 2
			remainingSeconds = "0" + remainingSeconds
		remainingMinutes = Math.floor(remaining / 60)

		<div className="scrubber">
			<div className="scrubber__remaining">-{remainingMinutes}:{remainingSeconds}</div>
			{points}
			<div className="scrubber__elapsed" style={handleStyle}>

			</div>
		</div>

module.exports = Scrubber
