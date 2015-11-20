React = require 'react'
SubscriptionList = require '../../../../subscription-list'
{subscribe} = require '../../../../subscription'

class Health extends React.Component
	componentDidMount: ->
		hero = @props.entity.getHero()

		@subs = new SubscriptionList
		@healthSub = subscribe hero, 'tag-changed:HEALTH tag-changed:DAMAGE', => @forceUpdate()
		@subs.add @healthSub
		@subs.add @props.entity, 'tag-changed:HERO', =>
			@healthSub.move @props.entity.getHero()
			@forceUpdate()

	componentWillUnmount: ->
		@subs.off()

	render: ->
		hero = @props.entity.getHero()
		return null unless hero

		return <div className="health">
			{hero.tags.HEALTH - (hero.tags.DAMAGE or 0)}
		</div>

module.exports = Health
