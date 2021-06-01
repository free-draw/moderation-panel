import React from "react"
import { Route } from "react-router-dom"

import Header from "/src/components/Header"

import ReportsView from "./View"
import ReportsList from "./List"

import "./style.scss"

function ReportsPage() {
	return (
		<Route path="/reports">
			<div className="page page-reports">
				<Header page="reports" />
				<div className="container">
					<ReportsView />
					<ReportsList />
				</div>
			</div>
		</Route>
	)
}

export default ReportsPage