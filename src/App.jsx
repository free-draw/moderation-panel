import React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"

import Home from "./pages/Home"
import Reports from "./pages/Reports"
import Bans from "./pages/Bans"
import Logs from "./pages/Logs"

class App extends React.Component {
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route component={Home} path="/" exact />
					<Route component={Reports} path="/reports" />
					<Route component={Bans} path="/bans" />
					<Route component={Logs} path="/logs" />
				</Switch>
			</BrowserRouter>
		)
	}
}

export default App