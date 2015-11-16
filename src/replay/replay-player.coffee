Entity = require './entity'
Player = require './player'
HistoryBatch = require './history-batch'
{Emitter} = require 'event-kit'
_ = require 'lodash'

class ReplayPlayer
	constructor: (@parser) ->
		@emitter = new Emitter

		@entities = {}
		@players = []

		@game = null
		@player = null
		@opponent = null

		@history = []
		@historyPosition = 0
		@lastBatch = null

		@startTimestamp = null
		@startTime = (new Date).getTime()

		@started = false
		window.replay = this

	run: ->
		@parser.parse(this)
		setInterval((=> @update()), 200)

	start: (timestamp) ->
		@startTimestamp = timestamp
		@started = true

	getTotalLength: ->
		position = @history.length - 1
		while position >= 0
			if @history[position].timestamp
				return @history[position].timestamp - @startTimestamp
			position--
		return 0

	getElapsed: ->
		((new Date).getTime() - @startTime) / 1000

	getTimestamps: ->
		return _.map @history, (batch) => batch.timestamp - @startTimestamp

	update: ->
		elapsed = @getElapsed()
		if @historyPosition < @history.length
			next = @history[@historyPosition]
			if not @history[@historyPosition].timestamp
				@history[@historyPosition].execute(this)
				@historyPosition++
			else
				if elapsed > @history[@historyPosition].timestamp - @startTimestamp
					@history[@historyPosition].execute(this)
					@historyPosition++


	receiveGameEntity: (definition) ->
		entity = new Entity(definition, this)
		@game = @entities[definition.id] = entity

	receivePlayer: (definition) ->
		entity = new Player(definition, this)
		@entities[definition.id] = entity
		@players.push(entity)
		if entity.tags.CURRENT_PLAYER
			@player = entity
		else
			@opponent = entity

	receiveEntity: (definition) ->
		entity = new Entity(definition, this)
		@entities[definition.id] = entity

		if definition.id is 68
			if definition.cardID is 'GAME_005'
				@player = entity.getController()
				@opponent = @player.getOpponent()
			else
				@opponent = entity.getController()
				@player = @opponent.getOpponent()

			@emitter.emit 'players-ready'

	receiveTagChange: (change) ->
		tags = {}
		tags[change.tag] = change.value

		if @entities[change.entity]
			entity = @entities[change.entity]
			entity.update tags: tags
		else

			entity = @entities[change.entity] = new Entity {
				id: change.entity
				tags: tags
			}, this

	receiveShowEntity: (definition) ->
		if @entities[definition.id]
			@entities[definition.id].update(definition)
		else
			@entities[definition.id] = new Entity(definition, this)

	receiveAction: (definition) ->

	receiveOptions: ->

	receiveChoices: (choices) ->

	receiveChosenEntities: (chosen) ->


	enqueue: (timestamp, command, args...) ->
		if not timestamp and @lastBatch
			@lastBatch.addCommand([command, args])
		else
			@lastBatch = new HistoryBatch(timestamp, [command, args])
			@history.push(@lastBatch)


	onPlayersReady: (callback) -> @emitter.on 'players-ready', callback

module.exports = ReplayPlayer
