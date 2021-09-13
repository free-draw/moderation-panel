import React from "react"
import { useRouteMatch } from "react-router"
import styled from "styled-components"

import { getReport } from "/src/api/reports"

import Page from "/src/components/Page"
import Snapshot from "/src/components/Snapshot"

import Actions from "./Actions"
import List from "./List"

const ReportsPageElement = styled(Page)`
	height: 100%;
`

const SnapshotElement = styled(Snapshot)`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`

function ReportsPage() {
	const match = useRouteMatch("/reports/:id")
	const id = match ? match.params.id : null

	const [ report, setReport ] = React.useState(null)
	React.useEffect(async () => {
		if (id) {
			const fetchedReport = await getReport(id)
			setReport(fetchedReport)
		} else {
			setReport(null)
		}
	}, [ id ])

	return (
		<ReportsPageElement>
			<SnapshotElement
				id={report ? report.snapshot : null}
				report={report}
				placeholder={{
					text: "No report selected",
					subtext: "Click on a report to get started!",
				}}
			/>
			<List />
			{ report ? <Actions report={report} /> : null }
		</ReportsPageElement>
	)
}

export default ReportsPage

export {
	ReportsPageElement,
	SnapshotElement,
}