import React from "react"
import styled, { createGlobalStyle } from "styled-components"
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
import Snapshots from "./pages/Snapshots"

const GlobalStyle = createGlobalStyle`
	html, body, #app {
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
		overflow: hidden;
		font-family: "Inter", "system-ui";
		font-weight: 400;

		@supports (font-variation-settings: normal) {
			font-family: "Inter var", "system-ui";
		}
	}

	* {
		box-sizing: border-box;
	}

	a {
		color: inherit;
		text-decoration: none;
	}

	#app {
		display: flex;
		flex-direction: column;
	}
`

const PageContainerElement = styled.div`
	flex-grow: 1;
	position: relative;
	overflow: hidden auto;
`

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
				<GlobalStyle />
				<Header />
				<PageContainerElement>
					<Switch>
						<Route component={Home} path="/" exact />
						<Route component={Reports} path="/reports" />
						<Route component={Users} path="/users" exact />
						<Route component={User} path="/users/:userId" />
						<Route component={Logs} path="/logs" />
						<Route component={Snapshots} path="/snapshots" />
					</Switch>
				</PageContainerElement>
			</BrowserRouter>
		)
	} else {
		return <LoginPrompt status={loginStatus} />
	}
}

export default App