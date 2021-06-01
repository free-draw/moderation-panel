import React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"

import Home from "/src/pages/Home"
import Reports from "/src/pages/Reports"

class App extends React.Component {
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route component={Home} path="/" exact />
					<Route component={Reports} path="/reports" />
				</Switch>
			</BrowserRouter>
		)
	}
}

export default App