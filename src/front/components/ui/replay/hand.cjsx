React = require 'react'
Card = require './card'
SubscriptionList = require '../../../../subscription-list'
ReactCSSTransitionGroup = require 'react-addons-css-transition-group'
_ = require 'lodash'

Hand = React.createClass
	componentDidMount: ->
		@subs = new SubscriptionList

		for entity in @props.entity.getHand()
			@subscribeToEntity(entity)

		@subs.add @props.entity, 'entity-entered-hand', ({entity}) =>
			@subscribeToEntity(entity)
			@forceUpdate()

		@subs.add @props.entity, 'tag-changed:MULLIGAN_STATE', =>
			@forceUpdate()

	subscribeToEntity: (entity) ->
		entitySubs = @subs.add new SubscriptionList
		entitySubs.add entity, 'left-hand', =>
			entitySubs.off()
			@forceUpdate()
		entitySubs.add entity, 'tag-changed:ZONE_POSITION', =>
			@forceUpdate()

	componentWillUnmount: ->
		@subs.off()

	render: ->
		return null unless @props.entity.tags.MULLIGAN_STATE is 4

		active = _.filter @props.entity.getHand(), (entity) -> entity.tags.ZONE_POSITION > 0

		cards = active.map (entity) ->
			<Card entity={entity} key={entity.id} />

		return <ReactCSSTransitionGroup component="div" className="hand"
					transitionName="animate" transitionEnterTimeout={700}
					transitionLeaveTimeout={700}>
				{cards}
			</ReactCSSTransitionGroup>


module.exports = Hand
