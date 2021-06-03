import React from "react"
import { Link, useRouteMatch } from "react-router-dom"

import Maid from "/src/class/Maid"
import useAsync from "/src/util/useAsync"

import Spinner from "/src/components/Spinner"

import { getRobloxUser, getRobloxThumbnail } from "/src/api/roblox"
import { reportList } from "/src/api/reports"

function Report(props) {
	const report = props.report

	const path = `/reports/${report.id}`
	const match = useRouteMatch({ path, sensitive: true })

	const targetUser = useAsync(getRobloxUser)(report.target)
	const targetAvatar = useAsync(getRobloxThumbnail)("AvatarHeadShot", report.target, "150x150")

	return (
		<Link to={path} className={`report ${match ? "selected" : ""} ${targetUser ? "" : "loading"}`}>
			{
				targetUser ? (
					<>
						<img className="report-avatar" src={targetAvatar ?? ""} />
						<div className="report-text">
							<span className="report-username">{targetUser.name}</span>
							<span className="report-reason">{report.reason}</span>
						</div>
					</>
				) : (
					<Spinner />
				)
			}
		</Link>
	)
}

class ReportList extends React.Component {
	constructor() {
		super()

		this.maid = new Maid()

		this.state = {
			reports: reportList.current,
		}
	}

	componentDidMount() {
		reportList.connect()
		this.maid.listen(reportList, "update", reports => this.setState({ reports }))
	}

	componentWillUnmount() {
		reportList.disconnect()
		this.maid.clean()
	}

	render() {
		if (!this.state.reports) {
			return null
		}

		const reports = this.state.reports.map((report) => {
			return <Report key={report.id} report={report} />
		})
	
		return (
			<div className="reports-list">
				{reports}
			</div>
		)
	}
}

export default ReportList