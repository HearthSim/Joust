React = require 'react'
{Window, Toolbar} = require 'react-photonkit'

module.exports = Application = React.createClass
	render: ->
		<Window>
			<Toolbar title="Joust" className="title-bar" />

			<div className="application">
				{@props.children}
			</div>
		</Window>

	componentDidMount: ->
		# Redirect straight to the replay for now
		@props.history.push('/replay')
