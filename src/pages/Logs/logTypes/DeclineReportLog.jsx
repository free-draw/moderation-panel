import React from "react"

import ReportLog from "../genericLogTypes/ReportLog"

function ReportDeclineLog(props) {
	const { report } = props.log.data

	return (
		<ReportLog
			text={(data) => {
				return (
					<>
						{data.sourceElement} declined report from Roblox user {report.fromUserId}
					</>
				)
			}}
			log={props.log}
		/>
	)
}

export default ReportDeclineLog