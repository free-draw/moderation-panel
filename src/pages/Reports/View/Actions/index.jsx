import React from "react"
import { mdiAccountBoxMultipleOutline } from "@mdi/js"

import Dialog from "/src/components/Dialog"
import Dropdown from "/src/components/Dropdown"

import AcceptIcon from "./accept-icon.svg"
import DeclineIcon from "./decline-icon.svg"

import "./style.scss"

function ReportAcceptDialog(props) {
	return (
		<Dialog
			title="Accept report"
			buttons={[
				{
					id: "cancel",
					text: "Cancel",
					style: "flat",
					onClick: props.close,
				},
				{
					id: "confirm",
					text: "Confirm",
					style: "bordered",
					onClick: () => {
						props.accept()
						props.close()
					},
				},
			]}
			onCancel={props.close}
		>
			<Dropdown
				currentOption="test"
				options={[
					{
						id: "test",
						text: "wawa",
						icon: mdiAccountBoxMultipleOutline,
					},
					{
						id: "test2",
						text: "wawaa",
						icon: mdiAccountBoxMultipleOutline,
					},
				]}
				onSelection={console.log}
			/>
		</Dialog>
	)
}

function Actions(props) {
	const report = props.report

	const [dialogOpen, setDialogOpen] = React.useState(false)
	
	return (
		<div className="actions">
			<div className="action action-accept" onClick={() => setDialogOpen(true)}>
				<AcceptIcon />
				{
					dialogOpen ? (
						<ReportAcceptDialog
							close={() => setDialogOpen(false)}
							accept={() => report.accept()}
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