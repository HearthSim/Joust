React = require 'react'
fs = require 'fs'
{subscribe} = require '../../../../subscription'

class Card extends React.Component
	componentDidMount: ->
		tagEvents = 'tag-changed:ATK tag-changed:HEALTH tag-changed:DAMAGE'
		@sub = subscribe @props.entity, tagEvents, =>
			@forceUpdate()

	componentWillUnmount: ->
		@sub.off()

	render: ->
		art = __dirname + "/../../../../../static/standard/#{@props.entity.cardID}.png"

		if @props.entity.cardID and fs.existsSync(art)
			style =
				background: "url(#{art}) top left no-repeat"
				backgroundSize: '100% auto'
			cls = "card"

		else
			style = {}
			cls = "card card--unknown"

		if @props.entity.tags.TAUNT
			cls += " card--taunt"

		if @props.stats
			stats = <div className="card__stats">
				<div className="card__stats__attack">{@props.entity.tags.ATK or 0}</div>
				<div className="card__stats__health">{@props.entity.tags.HEALTH - (@props.entity.tags.DAMAGE or 0)}</div>
			</div>

		return <div className={cls} style={style}>
			{stats}
		</div>

module.exports = Card
