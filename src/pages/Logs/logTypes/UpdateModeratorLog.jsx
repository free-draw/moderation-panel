import React from "react"

import ModeratorLog from "../genericLogTypes/ModeratorLog"

function UpdateModeratorLog(props) {
	const { moderator } = props.log.data

	return (
		<ModeratorLog
			text={(data) => {
				return (
					<>
						{data.sourceElement} updated moderator {moderator.name}
					</>
				)
			}}
			log={props.log}
		/>
	)
}

export default UpdateModeratorLog