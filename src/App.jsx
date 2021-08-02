import React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { useReduceMotion } from "react-reduce-motion"
import { Globals } from "react-spring"

import Header from "./components/Header"

import Home from "./pages/Home"
import Reports from "./pages/Reports"
import Users from "./pages/Users"
import Logs from "./pages/Logs"

function App() {
	const reducedMotion = useReduceMotion()

	React.useEffect(() => {
		Globals.assign({
			skipAnimation: reducedMotion,
		})
	}, [ reducedMotion ])

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