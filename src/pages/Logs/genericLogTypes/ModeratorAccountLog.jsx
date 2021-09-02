import React from "react"

import Log from "../Log"

function ModeratorLog(props) {
	const { log } = props
	const { account } = log.data

	return (
		<Log
			text={props.text}
			buttons={[]}
			fields={[
				{
					name: "Type",
					value: account.type,
					inline: true,
				},
				{
					name: "ID",
					value: account.id,
					inline: true,
				},
			]}
			log={log}
		/>
	)
}

export default ModeratorLog