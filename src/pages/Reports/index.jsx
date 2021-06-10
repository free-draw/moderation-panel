import React from "react"

import Header from "/src/components/Header"

import ReportsView from "./View"
import ReportsList from "./List"

import "./style.scss"

function ReportsPage() {
	return (
		<div className="page page-reports">
			<Header />
			<div className="container">
				<ReportsView />
				<ReportsList />
			</div>
		</div>
	)
}

export default ReportsPage