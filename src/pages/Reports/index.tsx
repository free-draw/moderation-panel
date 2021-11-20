import React from "react"
import { useRouteMatch } from "react-router"
import styled from "styled-components"
import { getReport, Report, ReportStatus } from "@free-draw/moderation-client"
import SnapshotViewerComponent from "../../components/SnapshotViewer"
import ListComponent from "./List"
import DetailsComponent from "./Details"
import ActionsComponent from "./Actions"
import API from "../../API"

export const ReportsPageElement = styled.div`
	height: 100%;
`

export const SnapshotViewerElement = styled(SnapshotViewerComponent)`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`

const ReportsPageComponent = () => {
	const match = useRouteMatch<{
		reportId: string,
	}>("/reports/:reportId")
	const reportId = match ? match.params.reportId : null

	const [ report, setReport ] = React.useState<Report | null>(null)
	React.useEffect(() => {
		if (reportId) {
			getReport(API, reportId).then(setReport)
		} else {
			setReport(null)
		}
	}, [ reportId ])

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
			<ListComponent />
			{report ? <DetailsComponent report={report} /> : null}
			{report && report.status === ReportStatus.PENDING ? <ActionsComponent report={report} /> : null}
		</ReportsPageElement>
	)
}

export default ReportsPageComponent