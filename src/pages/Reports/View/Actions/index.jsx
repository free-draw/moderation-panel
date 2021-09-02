import React from "react"
import ms from "ms"

import Dialog from "/src/components/Dialog"
import Dropdown from "/src/components/Dropdown"

import AcceptIcon from "./accept-icon.svg"
import DeclineIcon from "./decline-icon.svg"

const reasons = [
	{ id: "Griefing", name: "Griefing" },
	{ id: "NSFW", name: "NSFW" },
	{ id: "Scribbling", name: "Scribbling" },
	{ id: "Harassment", name: "Harassment" },
	{ id: "Exploits", name: "Exploits" },
	{ id: "FalseVotekicking", name: "False vote-kicking" },
	{ id: "Profanity", name: "Profanity/swearing" },
	{ id: "HateSpeech", name: "Hate speech" },
	{ id: "Other", name: "Other" },
]

const types = [
	{ id: "BAN", name: "Ban" },
	{ id: "DRAWBAN", name: "Draw-ban" },
	{ id: "MUTE", name: "Mute" },
]

const durations = [
	{ id: ms("3d"), name: "3 days" },
	{ id: ms("1w"), name: "1 week" },
	{ id: ms("2w"), name: "2 weeks" },
	{ id: ms("4w"), name: "1 month" },
	{ id: ms("12w"), name: "3 months" },
	{ id: ms("24w"), name: "6 months" },
	{ id: ms("1y"), name: "1 year" },
	{ id: "forever", name: "Forever" },
]

import "./style.scss"

function ReportAcceptDialog(props) {
	const report = props.report

	const [ reason, setReason ] = React.useState(report.reason)
	const [ type, setType ] = React.useState(null)
	const [ duration, setDuration ] = React.useState(null)

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
						if (reason && type && duration) {
							report.accept(type, reason, duration !== "forever" ? duration / 1000 : null)
							props.close()
						}
					},
				},
			]}
			onCancel={props.close}
		>
			<Dropdown
				index={1}
				placeholder="Reason"
				currentOptionId={reason}
				options={reasons}
				onSelection={setReason}
			/>
			<Dropdown
				index={2}
				placeholder="Type"
				currentOptionId={type}
				options={types}
				onSelection={setType}
			/>
			<Dropdown
				index={3}
				placeholder="Duration"
				currentOptionId={duration}
				options={durations}
				onSelection={setDuration}
			/>
		</Dialog>
	)
}

function Actions(props) {
	const report = props.report

	const [ dialogOpen, setDialogOpen ] = React.useState(false)

	return (
		<div className="actions">
			<div className="action action-accept" onClick={() => setDialogOpen(true)}>
				<AcceptIcon />
				{
					dialogOpen ? (
						<ReportAcceptDialog
							close={() => setDialogOpen(false)}
							report={report}
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