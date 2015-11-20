React = require 'react'
Card = require './card'
SubscriptionList = require '../../../../subscription-list'
ReactCSSTransitionGroup = require 'react-addons-css-transition-group'
_ = require 'lodash'
{zones} = require '../../../../replay/enums.coffee'

Play = React.createClass
	componentDidMount: ->
		@subs = new SubscriptionList

		@subs.add @props.entity, 'entity-entered-play', ({entity}) =>
			lastZone = entity.getLastZone()
			lastController = entity.getLastController()
			if lastZone is zones.HAND and (lastController is entity.getController() or not lastController)
				@setState playing: entity
				setTimeout (=> @setState playing: null), 1000

	getInitialState: ->
		playing: null

	componentWillUnmount: ->
		@subs.off()

	render: ->
		if @state.playing
			card = <Card entity={@state.playing} key={@state.playing.id} />
		else
			card = <div key={-1}></div>
		return <ReactCSSTransitionGroup component="div" className="play"
					transitionName="playing" transitionEnterTimeout={2000} transitionLeaveTimeout={500}>
					{card}
		</ReactCSSTransitionGroup>


module.exports = Play
