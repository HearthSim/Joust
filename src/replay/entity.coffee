{Emitter} = require 'event-kit'
{zones} = require './enums'
_ = require 'lodash'

class Entity
	constructor: (definition, @replay) ->
		@emitter = new Emitter
		@id = definition.id
		@tags = definition.tags
		@name = definition.name
		@cardID = definition.cardID
		@mulliganChoices = []

		if @tags.ZONE is zones.HAND
			@getController()?.notifyHandChanged?()
		if @tags.ZONE is zones.DECK
			@getController()?.notifyDeckChanged?()
		if @tags.ZONE is zones.PLAY
			@getController()?.notifyBoardChanged?()
		if @tags.RESOURCES_USED or @tags.RESOURCES
			@emitter.emit 'mana-changed'
		if @tags.HERO_ENTITY
			@emitter.emit 'hero-changed'

	getController: ->
		if @replay.player?.tags.CONTROLLER is @tags.CONTROLLER
			return @replay.player
		else if @replay.opponent?.tags.CONTROLLER is @tags.CONTROLLER
			return @replay.opponent
		return null

	update: (definition) ->
		@original = _.pick(@tags, Object.keys(definition.tags))

		if definition.id
			@id = definition.id
		if definition.tags
			for k, v of definition.tags
				@tags[k] = v
		if definition.cardID
			@cardID = definition.cardID

		zoneChange = (definition.tags.ZONE_POSITION or definition.tags.CONTROLLER or definition.tags.ZONE)

		if zoneChange and (@original.ZONE is zones.HAND or @tags.ZONE is zones.HAND)
			@getController()?.notifyHandChanged?()
		if zoneChange and (@original.ZONE is zones.DECK or @tags.ZONE is zones.DECK)
			@getController()?.notifyDeckChanged?()
		if zoneChange and (@original.ZONE is zones.PLAY or @tags.ZONE is zones.PLAY)
			@getController()?.notifyBoardChanged?()
		if definition.tags.MULLIGAN_STATE and @tags.MULLIGAN_STATE != @original.MULLIGAN_STATE
			@emitter.emit 'mulligan-state-changed'
		if definition.tags.HERO_ENTITY
			@emitter.emit 'hero-changed', @replay.entities[definition.tags.HERO_ENTITY]
		if definition.tags.HEALTH
			@emitter.emit 'stats-changed'
			@emitter.emit 'health-changed'
		if definition.tags.ATK
			@emitter.emit 'stats-changed'
			@emitter.emit 'attack-changed'
		if definition.tags.DAMAGE
			@emitter.emit 'stats-changed'
			@emitter.emit 'damage-changed'
		if @tags.RESOURCES_USED or @tags.RESOURCES
			@emitter.emit 'mana-changed'

	onStatsChanged: (callback) ->
		@emitter.on 'stats-changed', callback

	onHealthChanged: (callback) ->
		@emitter.on 'health-changed', callback

	onDamageChanged: (callback) ->
		@emitter.on 'damage-changed', callback

module.exports = Entity
