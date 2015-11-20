class Subscription
	@subscribe: (emitter, event, callback) ->
		new Subscription(emitter, event, callback)

	constructor: (@emitter, @event, @callback) ->
		@dead = false
		@emitter.on(event, @callback) for event in @event.split(/\s+/)

	off: ->
		return if @dead
		@emitter.removeListener(event, @callback) for event in @event.split(/\s+/)
		@dead = true

	move: (emitter) ->
		@off()
		@emitter = emitter
		@dead = false
		emitter.on(event, @callback) for event in @event.split(/\s+/)

module.exports = Subscription
