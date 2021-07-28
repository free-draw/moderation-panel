import React from "react"

import Page from "/src/components/Page"

import ReportsView from "./View"
import ReportsList from "./List"

import "./style.scss"

function ReportsPage() {
	return (
		<Page name="reports" fixed>
			<ReportsView />
			<ReportsList />
		</Page>
	)
}

export default ReportsPage