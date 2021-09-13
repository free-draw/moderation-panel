import React from "react"
import styled from "styled-components"
import ms from "ms"

import Dialog from "/src/components/Dialog"
import Dropdown from "/src/components/Dropdown"

import AcceptIcon from "./accept-icon.svg"
import DeclineIcon from "./decline-icon.svg"

import colors from "/src/presets/colors"

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

function ReportAcceptDialog({ report, close }) {
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
					onClick: close,
				},
				{
					id: "confirm",
					text: "Confirm",
					style: "bordered",
					onClick: () => {
						if (reason && type && duration) {
							report.accept(type, reason, duration !== "forever" ? duration / 1000 : null)
							close()
						}
					},
				},
			]}
			onCancel={close}
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

const ActionsElement = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	pointer-events: none;
	position: absolute;
	bottom: 60px;
	width: 100%;
	z-index: 10;
`

const ActionElement = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	width: 64px;
	height: 64px;
	cursor: pointer;
	pointer-events: all;
	background: white;
	box-sizing: border-box;
	background: white;

	border: 4px solid ${props => props.color};

	& + & {
		margin-left: 25px;
	}

	svg path {
		stroke: ${props => props.color};
		stroke-width: 4px;
	}

	:hover {
		border: none;
		background: ${props => props.color};

		svg path {
			stroke: white;
		}
	}
`

const AcceptActionElement = styled(ActionElement).attrs({
	color: colors.brand[600],
})``

const AcceptIconElement = styled(AcceptIcon)`
	width: 35px;
	height: 26px;
`

const DeclineActionElement = styled(ActionElement).attrs({
	color: "#d81b60",
})``

const DeclineIconElement = styled(DeclineIcon)`
	width: 30px;
	height: 30px;
`

function Actions({ report }) {
	const [ dialogOpen, setDialogOpen ] = React.useState(false)

	return (
		<ActionsElement>
			<AcceptActionElement onClick={() => setDialogOpen(true)}>
				<AcceptIconElement />
				{
					dialogOpen ? (
						<ReportAcceptDialog
							close={() => setDialogOpen(false)}
							report={report}
						/>
					) : null
				}
			</AcceptActionElement>

			<DeclineActionElement onClick={() => report.decline()}>
				<DeclineIconElement />
			</DeclineActionElement>
		</ActionsElement>
	)
}

export default Actions

export {
	ActionsElement,

	ActionElement,
	AcceptActionElement,
	DeclineActionElement,
}