import React from "react"
import { Route } from "react-router-dom"

import Header from "/src/components/Header"

import "./style.scss"

function LogsPage() {
	return (
		<Route path="/logs">
			<div className="page page-logs">
				<Header page="logs" />
			</div>
		</Route>
	)
}

export default LogsPage