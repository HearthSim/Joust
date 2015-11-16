{zones} = require './enums'
_ = require 'lodash'
Entity = require './entity'

class Player extends Entity
	constructor: (definition, replay) ->
		# Set some default values
		definition.tags.STARTHANDSIZE ?= 3
		definition.tags.RESOURCES ?= 1
		definition.tags.RESOURCES_USED ?= 0

		super(definition, replay)

	getHand: ->
		hand = _.filter @replay.entities, (entity) =>
			entity.tags.ZONE is zones.HAND and entity.tags.CONTROLLER is @tags.CONTROLLER

		return _.sortBy hand, (entity) -> entity.tags.ZONE_POSITION

	getDeck: ->
		return _.filter @replay.entities, (entity) =>
			entity.tags.ZONE is zones.DECK and entity.tags.CONTROLLER is @tags.CONTROLLER

	getBoard: ->
		board = _.filter @replay.entities, (entity) =>
			entity.tags.ZONE is zones.PLAY and entity.tags.CONTROLLER is @tags.CONTROLLER and entity.tags.CARDTYPE is 4

		return _.sortBy board, (entity) -> entity.tags.ZONE_POSITION

	getHero: -> @replay.entities[@tags.HERO_ENTITY]

	getOpponent: ->
		if @tags.CONTROLLER is 1
			return @replay.entities[3]
		else
			return @replay.entities[2]

	notifyHandChanged: ->
		@emitter.emit 'hand-changed'

	notifyDeckChanged: ->
		@emitter.emit 'deck-changed'

	notifyBoardChanged: ->
		@emitter.emit 'board-changed'

	onMulliganStateChanged: (callback) ->
		@emitter.on 'mulligan-state-changed', callback

	onHandChanged: (callback) ->
		@emitter.on 'hand-changed', callback

	onDeckChanged: (callback) ->
		@emitter.on 'deck-changed', callback

	onHeroChanged: (callback) ->
		@emitter.on 'hero-changed', callback

	onBoardChanged: (callback) ->
		@emitter.on 'board-changed', callback

	onManaChanged: (callback) ->
		@emitter.on 'mana-changed', callback

module.exports = Player
