import React from "react"

import ModeratorLog from "../genericLogTypes/ModeratorLog"

function CreateModeratorLog(props) {
	const { moderator } = props.log.data

	return (
		<ModeratorLog
			text={(data) => {
				return (
					<>
						{data.sourceElement} created a new moderator named <em>{moderator.name}</em>
					</>
				)
			}}
			log={props.log}
		/>
	)
}

export default CreateModeratorLog