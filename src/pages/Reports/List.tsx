import React from "react"
import styled from "styled-components"
import { Link, useRouteMatch, useHistory } from "react-router-dom"
import useAsync from "../../util/useAsync"
import { getPendingReports, getRobloxUser, getRobloxThumbnail, RobloxThumbnailType, Report } from "@free-draw/moderation-client"
import colors from "../../presets/colors"
import SpinnerComponent from "../../components/Spinner"
import API from "../../API"
import Realtime from "../../Realtime"
import { FixedSizeList } from "react-window"

const ReportContainerElement = styled.div``

const ReportElement = styled(Link)<{
	isSelected?: boolean,
}>`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	padding: ${props => props.isSelected ? 10 - 1 : 10}px;
	width: 320px;
	height: 86px;
	background: white;
	border: ${props => props.isSelected ? `2px solid ${colors.brand[600]}` : `1px solid ${colors.border}`};
	border-radius: 8px;
	cursor: pointer;
	user-select: none;
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

function ReportComponent({ data, index, style }: {
	data: Report[],
	index: number,
	style: React.CSSProperties,
}) {
	const report = data[index]

	const match = useRouteMatch<{
		id: string,
	}>("/reports/:id")

	const user = useAsync(getRobloxUser)(API, report.target.id)
	const avatar = useAsync(getRobloxThumbnail, [ report.target.id ])(API, {
		id: report.target.id,
		type: RobloxThumbnailType.AVATAR_HEADSHOT,
		size: "150x150",
	})

	return (
		<ReportContainerElement style={style}>
			<ReportElement to={`/reports/${report.id}`} isSelected={match ? match.params.id === report.id : false}>
				{
					user ? <>
						<ReportAvatarElement src={avatar ?? ""} />
						<ReportTextElement>
							<ReportUsernameText>{user.name}</ReportUsernameText>
							<ReportReasonText>{report.reason}</ReportReasonText>
						</ReportTextElement>
					</> : <SpinnerComponent />
				}
			</ReportElement>
		</ReportContainerElement>
	)
}

const ListContainerElement = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	width: 360px;
	height: 100%;
	display: flex;
	flex-direction: column;
	padding: 20px;
	overflow: auto hidden;

	pointer-events: none;
	> * > * {
		pointer-events: all;
	}
`

function ListComponent({ reports }: {
	reports: Report[],
}) {
	const listContainerRef = React.useRef() as React.RefObject<HTMLDivElement>
	const [ listSize, setListSize ] = React.useState(0)
	React.useLayoutEffect(() => {
		const newListSize = listContainerRef.current!.offsetHeight
		if (newListSize !== listSize) {
			setListSize(newListSize)
		}
	}, [ listSize ])

	return (
		<ListContainerElement ref={listContainerRef}>
			<FixedSizeList
				height={listSize}
				width="100%"
				itemSize={86 + 10}
				itemCount={reports.length}
				itemData={reports}
				itemKey={index => reports[index].id}
			>
				{ReportComponent}
			</FixedSizeList>
		</ListContainerElement>
	)
}

function ListStateManagerComponent() {
	const [ reports, setReports ] = React.useState<Report[]>([])

	React.useEffect(() => {
		getPendingReports(API).then((newReports) => {
			setReports(newReports)
		})
	}, [])

	const match = useRouteMatch<{
		id: string,
	}>("/reports/:id")
	const history = useHistory()
	const currentId = match ? match.params.id : null
	React.useEffect(() => {
		const onReportCreate = (report: Report) => {
			setReports([ ...reports, report ])
		}
		const onReportDelete = (report: Report) => {
			if (report.id === currentId) {
				const reportIndex = reports.findIndex(findReport => findReport.id === report.id)
				if (reportIndex !== -1) {
					const nextReport = reports[reportIndex + 1] ?? reports[reports.length]
					if (nextReport) {
						history.push(`/reports/${nextReport.id}`)
					} else {
						history.push("/reports")
					}
				}
			}

			setReports(reports.filter(filterReport => filterReport.id !== report.id))
		}

		Realtime.on("reportCreate", onReportCreate)
		Realtime.on("reportDelete", onReportDelete)

		return () => {
			Realtime.off("reportCreate", onReportCreate)
			Realtime.off("reportDelete", onReportDelete)
		}
	}, [ reports, currentId ])

	return <ListComponent reports={reports} />
}

export default ListStateManagerComponent

export {
	ListContainerElement,
}