import React from "react"

import ModeratorAccountLog from "../genericLogTypes/ModeratorAccountLog"

function CreateModeratorAccountLog(props) {
	const { moderator, account } = props.log.data

	return (
		<ModeratorAccountLog
			text={(data) => {
				return (
					<>
						{data.sourceElement} added a <em>{account.type}</em> account to <em>{moderator.name}</em>
					</>
				)
			}}
			log={props.log}
		/>
	)
}

export default CreateModeratorAccountLog