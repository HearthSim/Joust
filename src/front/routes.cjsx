React = require 'react'
{Router, Route} = require 'react-router'
{render} = require 'react-dom'
createMemoryHistory = require('history/lib/createMemoryHistory')

Application = require './components/application'
Replay = require './components/replay'

routes = <Route path="/" component={Application}>
		<Route path="/replay" component={Replay} />
</Route>

router = <Router history={createMemoryHistory()}>{routes}</Router>

render(router, document.getElementById('root'))
