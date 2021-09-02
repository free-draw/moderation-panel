import React from "react"

import ActionLog from "../genericLogTypes/ActionLog"

function CreateActionLog(props) {
	const { action, user } = props.log.data

	return (
		<ActionLog
			text={(data) => {
				return (
					<>
						{data.sourceElement} created a <em>{action.type}</em> on user <em>{user.name}</em>
					</>
				)
			}}
			log={props.log}
		/>
	)
}

export default CreateActionLog