class HistoryBatch
	constructor: (@timestamp, command) ->
		@commands = [command]

	addCommand: (command) ->
		@commands.push(command)

	execute: (replay) ->
		for command in @commands
			continue if command[0] is null
			replay[command[0]](command[1]...)

		return

module.exports = HistoryBatch
