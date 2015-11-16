React = require 'react'
{ButtonGroup, Button} = require 'react-photonkit'
ReplayPlayer = require '../../replay/replay-player'
HSReplayParser = require '../../replay/parsers/hs-replay'
PlayerName = require './ui/replay/player-name'
Hand = require './ui/replay/hand'
Deck = require './ui/replay/deck'
Mulligan = require './ui/replay/mulligan'
Board = require './ui/replay/board'
Mana = require './ui/replay/mana'
Health = require './ui/replay/health'
Scrubber = require './ui/replay/scrubber'

class Replay extends React.Component
	constructor: (props) ->
		super(props)

		replayPath = "#{__dirname + '/../../../replay/sample.xml'}"

		@state = replay: new ReplayPlayer(new HSReplayParser(replayPath))

		@state.replay.onPlayersReady => @forceUpdate()


	render: ->
		replay = @state.replay

		if replay.players.length == 2

			top = <div className="top">
				<PlayerName entity={replay.opponent} />
				<Deck entity={replay.opponent} />
				<Board entity={replay.opponent} />
				<Mulligan entity={replay.opponent} />
				<Mana entity={replay.opponent} />
				<Health entity={replay.opponent} />
				<Hand entity={replay.opponent} />
			</div>

			bottom = <div className="bottom">
				<PlayerName entity={replay.player} />
				<Deck entity={replay.player} />
				<Board entity={replay.player} />
				<Mulligan entity={replay.player} />
				<Mana entity={replay.player} />
				<Health entity={replay.player} />
				<Hand entity={replay.player} />
			</div>

		return <div className="replay">
			<form className="replay__controls padded">
				<ButtonGroup>
					<Button glyph="pause" onClick={@onClickPause}/>
					<Button glyph="play" onClick={@onClickPlay} />
					<Button glyph="fast-forward" onClick={@onClickFastForward} />
				</ButtonGroup>

				<Scrubber replay={replay} />
			</form>
			<div className="replay__game">
				{top}
				{bottom}
			</div>
		</div>

	onClickPause: ->

	onClickPlay: (e) =>
		e.preventDefault()
		@state.replay.run()

	onClickFastForward: ->

module.exports = Replay
