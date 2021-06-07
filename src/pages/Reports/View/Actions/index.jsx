import React from "react"

import Dialog from "/src/components/Dialog"

import AcceptIcon from "./accept-icon.svg"
import DeclineIcon from "./decline-icon.svg"

import "./style.scss"

function Actions(props) {
	const report = props.report

	const [dialogOpen, setDialogOpen] = React.useState(false)
	
	return (
		<div className="actions">
			<div className="action action-accept" onClick={dialogOpen ? null : () => setDialogOpen(true)}>
				<AcceptIcon />
				{
					dialogOpen ? (
						<Dialog
							title="Accept report"
							buttons={[
								{
									id: "cancel",
									text: "Cancel",
									style: "flat",
									onClick: () => setDialogOpen(false),
								},
								{
									id: "confirm",
									text: "Confirm",
									style: "bordered",
									onClick: () => {
										report.accept()
										setDialogOpen(false)
									},
								},
							]}
							onCancel={() => setDialogOpen(false)}
						/>
					) : null
				}
			</div>

			<div className="action action-decline" onClick={() => report.decline()}>
				<DeclineIcon />
			</div>
		</div>
	)
}

export default Actions