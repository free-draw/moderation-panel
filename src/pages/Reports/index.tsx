import React from "react"
import { useRouteMatch } from "react-router"
import styled from "styled-components"
import { getReport, Report, ReportStatus } from "@free-draw/moderation-client"
import Page from "../../components/Page"
import SnapshotViewer from "../../components/SnapshotViewer"
import List from "./List"
import Details from "./Details"
import Actions from "./Actions"
import API from "../../API"

const ReportsPageElement = styled(Page)`
	height: 100%;
`

const SnapshotViewerElement = styled(SnapshotViewer)`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`

function ReportsPage() {
	const match = useRouteMatch<{
		id: string,
	}>("/reports/:id")
	const id = match ? match.params.id : null

	const [ report, setReport ] = React.useState<Report | null>(null)
	React.useEffect(() => {
		if (id) {
			getReport(API, id).then(setReport)
		} else {
			setReport(null)
		}
	}, [ id ])

	return (
		<ReportsPageElement>
			<SnapshotViewerElement
				id={report ? report.snapshot!.id : null}
				report={report}
				placeholder={{
					text: "No report selected",
					subtext: "Click on a report to get started!",
				}}
			/>
			<List />
			{report ? <Details report={report} /> : null}
			{report && report.status === ReportStatus.PENDING ? <Actions report={report} /> : null}
		</ReportsPageElement>
	)
}

export default ReportsPage

export {
	ReportsPageElement,
	SnapshotViewerElement,
}