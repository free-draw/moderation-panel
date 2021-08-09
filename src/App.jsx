import React from "react"
import Cookies from "js-cookie"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { useReduceMotion } from "react-reduce-motion"
import { Globals } from "react-spring"

import { getCurrentUser } from "/src/api/auth"

import Header from "./components/Header"
import LoginPrompt from "./components/LoginPrompt"

import Home from "./pages/Home"
import Reports from "./pages/Reports"
import Users from "./pages/Users"
import User from "./pages/User"
import Logs from "./pages/Logs"

function App() {
	const reducedMotion = useReduceMotion()
	React.useEffect(() => {
		Globals.assign({
			skipAnimation: reducedMotion,
		})
	}, [ reducedMotion ])

	const [ loginStatus, setLoginStatus ] = React.useState("UNKNOWN")
	React.useEffect(async () => {
		try {
			await getCurrentUser()
			setLoginStatus("SUCCESS")
		} catch {
			setLoginStatus("INVALID_USER")
		}
	}, [])

	if (loginStatus === "SUCCESS" || loginStatus === "UNKNOWN") {
		return (
			<BrowserRouter>
				<Header />
				<div className="page-container">
					<Switch>
						<Route component={Home} path="/" exact />
						<Route component={Reports} path="/reports" />
						<Route component={Users} path="/users" exact />
						<Route component={User} path="/users/:userId" />
						<Route component={Logs} path="/logs" />
					</Switch>
				</div>
			</BrowserRouter>
		)
	} else {
		return <LoginPrompt status={loginStatus} />
	}
}

export default App