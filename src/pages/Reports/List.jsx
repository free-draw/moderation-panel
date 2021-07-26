import React from "react"
import { Link, useRouteMatch } from "react-router-dom"
import Icon from "@mdi/react"
import { mdiBroom } from "@mdi/js"

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

		if (this.state.reports.length > 0) {
			const reports = this.state.reports.map((report) => {
				return <Report key={report.id} report={report} />
			})
		
			return (
				<div className="reports-list">
					{reports}
				</div>
			)
		} else {
			return (
				<div className="reports-list empty">
					<div className="empty-container">
						<Icon
							path={mdiBroom}
							size={3}
							color="black"
							className="empty-icon"
						/>
						<span className="empty-primary-text">All done!</span>
						<span className="empty-secondary-text">It looks like you've cleared out all the reports — hooray!</span>
					</div>
				</div>
			)
		}
	}
}

export default ReportList