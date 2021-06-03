import React from "react"
import { useRouteMatch } from "react-router-dom" 

import { getReport } from "/src/api/reports"
import { getSnapshot } from "/src/api/snapshots"

import Viewer from "/src/components/Viewer"
import Details from "./Details"

import "./style.scss"

function ReportsView() {
	const match = useRouteMatch("/reports/:reportId")

	const [ report, setReport ] = React.useState(null)
	const [ snapshot, setSnapshot ] = React.useState(null)
	const [ status, setStatus ] = React.useState("NONE")

	React.useEffect(async () => {
		setReport(null)
		setSnapshot(null)

		if (match) {
			setStatus("LOADING")

			try {
				const report = await getReport(match.params.reportId)
				const snapshot = await getSnapshot(report.snapshot)

				await snapshot.initialize()

				setReport(report)
				setSnapshot(snapshot)

				setStatus("LOADED")
			} catch(error) {
				setStatus("ERROR")
				throw error
			}
		} else {
			setStatus("NONE")
		}
	}, [ match ? match.params.reportId : null ])

	switch (status) {
		case "LOADED":
			return (
				<div className="reports-view">
					<Details report={report} snapshot={snapshot} />
					<Viewer data={snapshot.canvas} />
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