import React from "react"
import { Link, useRouteMatch } from "react-router-dom"

import makeClassName from "/src/util/makeClassName"

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
	return (
		<div className="header">
			<img src={logo} className="header-logo" />
			<div className="header-navigation">
				<HeaderNavigationButton text="Home" to="/" exact />
				<HeaderNavigationButton text="Reports" to="/reports" />
				<HeaderNavigationButton text="Users" to="/users" />
				<HeaderNavigationButton text="Logs" to="/logs" />
			</div>
		</div>
	)
}

export default Header