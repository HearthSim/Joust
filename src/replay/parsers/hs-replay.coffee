fs = require 'fs'
sax = require 'sax'
{tagNames} = require '../enums'

tsToSeconds = (ts) ->
	parts = ts.split(':')
	hours = parseInt(parts[0]) * 60 * 60
	minutes = parseInt(parts[1]) * 60
	seconds = parseFloat(parts[2])

	return hours + minutes + seconds

class HSReplayParser
	constructor: (@path) ->
		@entities = {}
		@state = ['root']
		@entityDefinition = {tags: {}}
		@actionDefinition = {}
		@stack = []

	parse: (replay) ->
		@replay = replay
		@sax = sax.createStream(true)

		@sax.on 'opentag', (node) => @onOpenTag(node)
		@sax.on 'closetag', => @onCloseTag()

		@stream = fs.createReadStream(@path).pipe(@sax)

	rootState: (node) ->
		switch node.name
			when 'Game'
				@replay.start(tsToSeconds(node.attributes.ts))

			when 'Action'
				@replay.enqueue tsToSeconds(node.attributes.ts), 'receiveAction'
				@state.push('action')

			when 'TagChange'
				@replay.enqueue null, 'receiveTagChange',
					entity: parseInt(node.attributes.entity)
					tag: tagNames[node.attributes.tag]
					value: parseInt(node.attributes.value)

			when 'GameEntity', 'Player', 'FullEntity'
				@state.push('entity')
				@entityDefinition.id = parseInt(node.attributes.id)
				if node.attributes.cardID
					@entityDefinition.cardID = node.attributes.cardID
				if node.attributes.name
					@entityDefinition.name = node.attributes.name

			when 'Options'
				@state.push('options')

			when 'ChosenEntities'
				@chosen =
					entity: node.attributes.entity
					playerID: node.attributes.playerID
					ts: tsToSeconds(node.attributes.ts)
					cards: []
				@state.push('chosenEntities')

	chosenEntitiesState: (node) ->
		switch node.name
			when 'Choice'
				@chosen.cards.push(node.attributes.entity)

	chosenEntitiesStateClose: (node) ->
		switch node.name
			when 'ChosenEntities'
				@state.pop()
				@replay.enqueue @chosen.ts, 'receiveChosenEntities', @chosen

	optionsStateClose: (node) ->
		switch node.name
			when 'Options'
				@state.pop()
				@replay.enqueue tsToSeconds(node.attributes.ts), 'receiveOptions', node

	entityState: (node) ->
		switch node.name
			when 'Tag'
				@entityDefinition.tags[tagNames[parseInt(node.attributes.tag)]] = parseInt(node.attributes.value)

	entityStateClose: (node) ->
		if node.attributes.ts
			ts = tsToSeconds(node.attributes.ts)
		else
			ts = null

		switch node.name
			when 'GameEntity'
				@state.pop()
				@replay.enqueue ts, 'receiveGameEntity', @entityDefinition
				@entityDefinition = {tags: {}}
			when 'Player'
				@state.pop()
				@replay.enqueue ts, 'receivePlayer', @entityDefinition
				@entityDefinition = {tags: {}}
			when 'FullEntity'
				@state.pop()
				@replay.enqueue ts, 'receiveEntity', @entityDefinition
				@entityDefinition = {tags: {}}
			when 'ShowEntity'
				@state.pop()
				@replay.enqueue ts, 'receiveShowEntity', @entityDefinition
				@entityDefinition = {tags: {}}

	actionState: (node) ->
		switch node.name
			when 'ShowEntity', 'FullEntity'
				@state.push('entity')
				@entityDefinition.id = parseInt(node.attributes.entity or node.attributes.id)
				if node.attributes.cardID
					@entityDefinition.cardID = node.attributes.cardID
				if node.attributes.name
					@entityDefinition.name = node.attributes.name

			when 'TagChange'
				@replay.enqueue null, 'receiveTagChange',
					entity: parseInt(node.attributes.entity)
					tag: tagNames[node.attributes.tag]
					value: parseInt(node.attributes.value)
			when 'Action'
				@state.push('action')
				@replay.enqueue tsToSeconds(node.attributes.ts), 'receiveAction'

			when 'Choices'
				@choices =
					entity: parseInt(node.attributes.entity)
					max: node.attributes.max
					min: node.attributes.min
					playerID: node.attributes.playerID
					source: node.attributes.source
					ts: tsToSeconds(node.attributes.ts)
					cards: []
				@state.push('choices')

	choicesState: (node) ->
		switch node.name
			when 'Choice'
				@choices.cards.push(node.attributes.entity)

	choicesStateClose: (node) ->
		switch node.name
			when 'Choices'
				@state.pop()
				@replay.enqueue @choices.ts, 'receiveChoices', @choices

	actionStateClose: (node) ->
		if node.attributes.ts
			ts = tsToSeconds(node.attributes.ts)
		else
			ts = null
		switch node.name
			when 'Action'
				@state.pop()

	onOpenTag: (node) ->
		@stack.push(node)
		@["#{@state[@state.length-1]}State"]?(node)

	onCloseTag: () ->
		node = @stack.pop()
		@["#{@state[@state.length-1]}StateClose"]?(node)


module.exports = HSReplayParser
