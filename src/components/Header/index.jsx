import React from "react"
import { Link, useRouteMatch } from "react-router-dom"
import Icon from "@mdi/react"
import { mdiCog } from "@mdi/js"
import { useSpring, animated } from "react-spring"

import makeClassName from "/src/util/makeClassName"

import { getCurrentUser } from "/src/api/auth"

import logo from "url:/src/assets/logo.svg"

import "./style.scss"

function HeaderNavigationButton(props) {
	const match = useRouteMatch({ path: props.to, exact: props.exact })

	return (
		<Link className={makeClassName("header-navigation-button", { active: !!match })} to={props.to}>
			<span className="header-navigation-button-text">{props.text}</span>
		</Link>
	)
}

function Header() {
	const [ loaded, setLoaded ] = React.useState(false)
	const [ settingsOpen, setSettingsOpen ] = React.useState(false)
	const [ username, setUsername ] = React.useState("")

	React.useEffect(async () => {
		const { type, moderator } = await getCurrentUser()
		setUsername(type === "SERVER" ? "[SERVER]" : moderator.name)
		setLoaded(true)
	}, [])

	const settingsSpring = useSpring({
		to: { active: settingsOpen ? 1 : 0 },
		config: {
			frequency: 1/6,
			damping: 0.7,
		},
	})

	return (
		<div className="header">
			<img src={logo} className="header-logo" />
			<div className="header-navigation">
				<HeaderNavigationButton text="Home" to="/" exact />
				<HeaderNavigationButton text="Reports" to="/reports" />
				<HeaderNavigationButton text="Users" to="/users" />
				<HeaderNavigationButton text="Logs" to="/logs" />
			</div>
			<div className="header-spacer" />
			<div className="header-context">
				{
					loaded ? (
						<span className="current-user">
							Logged in as <em>{username}</em>
						</span>
					) : null
				}
				<div className="settings-container">
					<Icon
						className="settings-icon"
						path={mdiCog}
						size={1}
						onClick={() => setSettingsOpen(!settingsOpen)}
					/>
					<animated.div
						className={makeClassName("settings", { open: settingsOpen })}
						style={{
							transform: settingsSpring.active.to(value => `translate(0px, ${-(1 - value) * 10}px)`),
							opacity: settingsSpring.active,
							display: settingsSpring.active.to(value => value > 0.025 ? "block" : "none"),
						}}
					>
						<span className="settings-notice">There's nothing here yet!</span>
					</animated.div>
				</div>
			</div>
		</div>
	)
}

export default Header