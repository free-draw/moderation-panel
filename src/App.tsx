import React from "react"
import styled, { createGlobalStyle } from "styled-components"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import API from "./API"
import { getModerator, getToken, TokenType } from "@free-draw/moderation-client"
import HeaderComponent from "./components/Header"
import LoginPromptComponent from "./components/LoginPrompt"
import HomeComponent from "./pages/Home"
import ReportsComponent from "./pages/Reports"
import UsersComponent from "./pages/Users"
import UserComponent from "./pages/User"
import LogsComponent from "./pages/Logs"
import SnapshotsComponent from "./pages/Snapshots"

import "@fontsource/inter"
import "@fontsource/inter/variable.css"

const GlobalStyle = createGlobalStyle`
	html, body, #app {
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
		overflow: hidden;
	}

	body, textarea {
		font-family: "Inter", "system-ui", sans-serif;
		font-weight: 400;

		@supports (font-variation-settings: normal) {
			font-family: "InterVariable", "system-ui", sans-serif;
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

enum LoginStatus {
	UNKNOWN = "UNKNOWN",
	SUCCESS = "SUCCESS",
	INVALID_USER = "INVALID_USER",
	DEACTIVATED_ACCOUNT = "DEACTIVATED_ACCOUNT",
}

const AppComponent = () => {
	const [ loginStatus, setLoginStatus ] = React.useState<LoginStatus>(LoginStatus.UNKNOWN)
	React.useEffect(() => {
		getToken(API).then((token) => {
			if (token.type === TokenType.USER) {
				getModerator(API, token.id!).then((moderator) => {
					if (moderator?.active) {
						setLoginStatus(LoginStatus.SUCCESS)
					} else {
						setLoginStatus(LoginStatus.DEACTIVATED_ACCOUNT)
					}
				})
			} else {
				setLoginStatus(LoginStatus.SUCCESS)
			}
		}).catch(() => {
			setLoginStatus(LoginStatus.INVALID_USER)
		})
	}, [])

	if (loginStatus === LoginStatus.SUCCESS || loginStatus === LoginStatus.UNKNOWN) {
		return (
			<BrowserRouter>
				<GlobalStyle />
				<HeaderComponent />
				<PageContainerElement>
					<Switch>
						<Route component={HomeComponent} path="/" exact />
						<Route component={ReportsComponent} path="/reports" />
						<Route component={UsersComponent} path="/users" exact />
						<Route component={UserComponent} path="/users/:userId" />
						<Route component={LogsComponent} path="/logs" />
						<Route component={SnapshotsComponent} path="/snapshots" />
					</Switch>
				</PageContainerElement>
			</BrowserRouter>
		)
	} else {
		return (
			<>
				<GlobalStyle />
				<LoginPromptComponent />
			</>
		)
	}
}

export default AppComponent