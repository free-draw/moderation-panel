import React from "react"

import Log from "../Log"

function ModeratorLog(props) {
	const { log } = props
	const { moderator } = log.data

	return (
		<Log
			text={props.text}
			buttons={[]}
			fields={[
				{
					name: "Name",
					value: moderator.name,
					inline: true,
				},
			]}
			log={log}
		/>
	)
}

export default ModeratorLog