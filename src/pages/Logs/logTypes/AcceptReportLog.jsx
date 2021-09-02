import React from "react"

import ReportLog from "../genericLogTypes/ReportLog"

function ReportAcceptLog(props) {
	const { report } = props.log.data

	return (
		<ReportLog
			text={(data) => {
				return (
					<>
						{data.sourceElement} accepted report from Roblox user {report.fromUserId}
					</>
				)
			}}
			log={props.log}
		/>
	)
}

export default ReportAcceptLog