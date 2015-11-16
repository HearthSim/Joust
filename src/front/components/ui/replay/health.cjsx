React = require 'react'

class Health extends React.Component
	componentDidMount: ->
		hero = @props.entity.getHero()
		if hero
			hero.onHealthChanged => @forceUpdate()
			hero.onDamageChanged => @forceUpdate()

		@props.entity.onHeroChanged (entity) =>
			entity.onHealthChanged => @forceUpdate()
			entity.onDamageChanged => @forceUpdate()

			@forceUpdate()

	render: ->
		hero = @props.entity.getHero()
		return null unless hero

		return <div className="health">
			{hero.tags.HEALTH - (hero.tags.DAMAGE or 0)}
		</div>

module.exports = Health
