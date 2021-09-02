import React from "react"
import { useHistory } from "react-router-dom"

import Log from "../Log"

function ActionLog(props) {
	const { log } = props
	const { action } = log.data

	const history = useHistory()

	return (
		<Log
			text={props.text}
			buttons={[
				{
					id: "view",
					text: "View Snapshot",
					style: "filled",
					disabled: !action.snapshot,
					onClick: () => {
						if (action.snapshot) {
							history.push(`/snapshots/${action.snapshot}`)
						}
					},
				},
			]}
			fields={[
				{
					name: "Notes",
					value: action.notes ?? "No notes specified",
					empty: !action.notes,
					inline: false,
				},
				{
					name: "Type",
					value: action.type,
					inline: true,
				},
				{
					name: "Reason",
					value: action.reason,
					inline: true,
				},
			]}
			log={log}
		/>
	)
}

export default ActionLog