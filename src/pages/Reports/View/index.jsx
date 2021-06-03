import React from "react"
import { useRouteMatch } from "react-router-dom" 

import reports from "/src/api/reports"

import Details from "./Details"

import "./style.scss"

function ReportsView() {
	const match = useRouteMatch("/reports/:reportId")

	const [ report, setReport ] = React.useState(null)
	const [ reportStatus, setReportStatus ] = React.useState("NONE")

	React.useEffect(async () => {
		setReport(null)

		if (match) {
			setReportStatus("LOADING")

			try {
				setReport(await reports.getReport(match.params.reportId))
				setReportStatus("LOADED")
			} catch(error) {
				setReportStatus("ERROR")
			}
		} else {
			setReportStatus("NONE")
		}
	}, [ match ? match.params.reportId : null ])

	switch (reportStatus) {
		case "LOADED":
			return (
				<div className="reports-view">
					<Details report={report} />
				</div>
			)
		
		case "LOADING":
			return (
				<div className="reports-view text-only">
					<span className="reports-view-text-primary">Loading report...</span>
				</div>
			)
		
		case "ERROR":
			return (
				<div className="reports-view text-only">
					<span className="reports-view-text-primary">Failed to load report</span>
					<span className="reports-view-text-secondary">Check the console for more info</span>
				</div>
			)
		
		case "NONE":
			return (
				<div className="reports-view text-only">
					<span className="reports-view-text-primary">No report selected</span>
					<span className="reports-view-text-secondary">Click on a report to get started!</span>
				</div>
			)
	}
}

export default ReportsView