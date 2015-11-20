Subscription = require './subscription'

class SubscriptionList
	constructor: ->
		@dead = false
		@subscriptions = []

	add: (emitter, event, callback) ->
		@dead = false
		if emitter instanceof Subscription or emitter instanceof SubscriptionList
			@subscriptions.push emitter
			return emitter
		else
			subscription = new Subscription(emitter, event, callback)
			@subscriptions.push subscription
			return subscription


	off: ->
		return if @dead
		sub.off() for sub in @subscriptions
		@dead = true

module.exports = SubscriptionList
