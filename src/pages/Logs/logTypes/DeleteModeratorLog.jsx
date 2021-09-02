import React from "react"

import ModeratorLog from "../genericLogTypes/ModeratorLog"

function DeleteModeratorLog(props) {
	const { moderator } = props.log.data

	return (
		<ModeratorLog
			text={(data) => {
				return (
					<>
						{data.sourceElement} disabled <em>{moderator.name}</em>'s account
					</>
				)
			}}
			log={props.log}
		/>
	)
}

export default DeleteModeratorLog