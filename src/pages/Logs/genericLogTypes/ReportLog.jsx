import React from "react"
import { useHistory } from "react-router-dom"

import Log from "../Log"

function ReportLog(props) {
	const { log } = props
	const { report } = log.data

	const history = useHistory()

	return (
		<Log
			text={props.text}
			buttons={[
				{
					id: "view",
					text: "View Report",
					style: "filled",
					onClick: () => {
						history.push(`/reports/${report.id}`)
					},
				},
			]}
			fields={[
				{
					name: "Target",
					value: report.targetUserId,
					inline: true,
				},
				{
					name: "Reason",
					value: report.reason,
					inline: true,
				},
				{
					name: "Notes",
					value: report.notes ?? "No notes specified",
					empty: !report.notes,
					inline: true,
				},
			]}
			log={log}
		/>
	)
}

export default ReportLog