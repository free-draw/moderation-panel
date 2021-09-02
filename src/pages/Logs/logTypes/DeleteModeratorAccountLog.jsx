import React from "react"

import ModeratorAccountLog from "../genericLogTypes/ModeratorAccountLog"

function DeleteModeratorAccountLog(props) {
	const { moderator, account } = props.log.data

	return (
		<ModeratorAccountLog
			text={(data) => {
				return (
					<>
						{data.sourceElement} removed a <em>{account.type}</em> account from <em>{moderator.name}</em>
					</>
				)
			}}
			log={props.log}
		/>
	)
}

export default DeleteModeratorAccountLog