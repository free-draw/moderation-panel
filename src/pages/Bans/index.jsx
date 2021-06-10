import React from "react"
import { Route } from "react-router-dom"

import Header from "/src/components/Header"

import "./style.scss"

function BansPage() {
	return (
		<Route path="/bans">
			<div className="page page-bans">
				<Header page="bans" />
			</div>
		</Route>
	)
}

export default BansPage