import React from "react"
import { Route } from "react-router-dom"

import Header from "/src/components/Header"

import "./style.scss"

function HomePage() {
	return (
		<Route path="/" exact>
			<div className="page page-home">
				<Header page="home" />
			</div>
		</Route>
	)
}

export default HomePage