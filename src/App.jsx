import React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"

import Header from "./components/Header"

import Home from "./pages/Home"
import Reports from "./pages/Reports"
import Users from "./pages/Users"
import Logs from "./pages/Logs"

function App() {
	return (
		<BrowserRouter>
			<Header />
			<div className="page-container">
				<Switch>
					<Route component={Home} path="/" exact />
					<Route component={Reports} path="/reports" />
					<Route component={Users} path="/users" exact />
					<Route component={Logs} path="/logs" />
				</Switch>
			</div>
		</BrowserRouter>
	)
}

export default App