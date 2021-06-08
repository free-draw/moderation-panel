import React from "react"
import { Link } from "react-router-dom"

import makeClassName from "/src/util/makeClassName"

import logo from "url:/src/assets/logo.svg"

import "./style.scss"

function HeaderNavigationButton(props) {
	return (
		<Link className={makeClassName("header-navigation-button", { active: props.active })} to={props.to}>
			<span className="header-navigation-button-text">{props.text}</span>
		</Link>
	)
}

function Header(props) {
	return (
		<div className="header">
			<img src={logo} className="header-logo" />
			<div className="header-navigation">
				<HeaderNavigationButton text="Home" to="/" active={props.page === "home"} />
				<HeaderNavigationButton text="Reports" to="/reports" active={props.page === "reports"} />
				<HeaderNavigationButton text="Bans" to="/bans" />
				<HeaderNavigationButton text="Logs" to="/logs" />
			</div>
		</div>
	)
}

export default Header