import React from "react"
import styled from "styled-components"
import { Link, useRouteMatch } from "react-router-dom"
import useAsync from "/src/util/useAsync"
import { getPendingReports, getRobloxUser, getRobloxThumbnail, RobloxThumbnailType } from "@free-draw/moderation-client"
import colors from "/src/presets/colors"
import Spinner from "/src/components/Spinner"
import API from "/src/API"
import Realtime from "/src/Realtime"

const ReportElement = styled(Link)`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	padding: ${props => props.selected ? 10 - 1 : 10}px;
	width: 320px;
	height: 86px;
	background: white;
	border: ${props => props.selected ? `2px solid ${colors.brand[600]}` : `1px solid ${colors.border}`};
	border-radius: 8px;
	cursor: pointer;
	user-select: none;

	& + & {
		margin-top: 10px;
	}
`

const ReportAvatarElement = styled.img`
	width: 64px;
	height: 64px;
	border-radius: 50%;
`

const ReportTextElement = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	margin-left: 20px;
`

const ReportUsernameText = styled.span`
	font-size: 18px;
	font-weight: 700;
`

const ReportReasonText = styled.span`
	font-size: 16px;
	font-weight: 400;
	margin-top: 4px;
`

function Report({ report }) {
	const match = useRouteMatch("/reports/:id")

	const user = useAsync(getRobloxUser)(API, report.target.id)
	const avatar = useAsync(getRobloxThumbnail, [ report.target.id ])(API, {
		id: report.target.id,
		type: RobloxThumbnailType.AVATAR_HEADSHOT,
		size: "150x150",
	})

	if (user) {
		return (
			<ReportElement to={`/reports/${report.id}`} selected={match && match.params.id === report.id}>
				<ReportAvatarElement src={avatar} />
				<ReportTextElement>
					<ReportUsernameText>{user.name}</ReportUsernameText>
					<ReportReasonText>{report.reason}</ReportReasonText>
				</ReportTextElement>
			</ReportElement>
		)
	} else {
		return (
			<ReportElement>
				<Spinner />
			</ReportElement>
		)
	}
}

const ListElement = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	height: 100%;
	display: flex;
	flex-direction: column;
	padding: 20px;
	overflow: auto hidden;

	pointer-events: none;
	> * {
		pointer-events: all;
	}
`

function List() {
	const [ reports, setReports ] = React.useState([])

	React.useEffect(() => {
		getPendingReports(API).then((newReports) => {
			setReports(newReports)
		})
	}, [])

	React.useEffect(() => {
		const onReportCreate = (newReport) => {
			setReports([ ...reports, newReport ])
		}
		const onReportDelete = (report) => {
			setReports(reports.filter(filterReport => filterReport.id !== report.id))
		}

		Realtime.on("reportCreate", onReportCreate)
		Realtime.on("reportDelete", onReportDelete)

		return () => {
			Realtime.off("reportCreate", onReportCreate)
			Realtime.off("reportDelete", onReportDelete)
		}
	}, [ reports ])

	return (
		<ListElement>
			{
				reports.map(report => <Report key={report.id} report={report} />)
			}
		</ListElement>
	)
}

export default List

export {
	ListElement,
}