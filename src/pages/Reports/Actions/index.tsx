import React from "react"
import styled from "styled-components"
import API from "../../../API"
import { ActionType, Report } from "@free-draw/moderation-client"
import ModerationPresetReason, { ModerationPresetReasonStrings } from "../../../enum/ModerationPresetReason"
import ModerationPresetDuration, { ModerationPresetDurationStrings, ModerationPresetDurationLengths } from "../../../enum/ModerationPresetDuration"
import Dialog from "../../../components/Dialog"
import Dropdown from "../../../components/Dropdown"
import AcceptIcon from "./accept-icon.svg"
import DeclineIcon from "./decline-icon.svg"
import colors from "../../../presets/colors"
import ButtonStyle from "../../../enum/ButtonStyle"

function ReportAcceptDialog({ report, onClose }: {
	report: Report,
	onClose: () => void,
}) {
	const [ type, setType ] = React.useState<ActionType | null>(null)
	const [ reason, setReason ] = React.useState<ModerationPresetReason | null>(null)
	const [ duration, setDuration ] = React.useState<ModerationPresetDuration | null>(null)

	return (
		<Dialog
			title="Accept report"
			buttons={[
				{
					id: "cancel",
					text: "Cancel",
					style: ButtonStyle.FLAT,
					onClick: close,
				},
				{
					id: "confirm",
					text: "Confirm",
					style: ButtonStyle.BORDERED,
					onClick: () => {
						if (reason && type && duration) {
							report.accept(API, {
								type,
								reason: ModerationPresetReasonStrings[reason],
								duration: duration && duration !== ModerationPresetDuration.FOREVER ? ModerationPresetDurationLengths[duration]! / 1000 : undefined,
							})

							onClose()
						}
					},
				},
			]}
			onCancel={onClose}
		>
			<Dropdown
				index={1}
				placeholder="Type"
				options={Object.values(ActionType).map(value => ({ id: value, name: value }))}
				currentOptionId={type}
				onSelection={setType}
			/>
			<Dropdown
				index={2}
				placeholder="Reason"
				options={Object.values(ModerationPresetReason).map(value => ({ id: value, name: ModerationPresetReasonStrings[value] }))}
				currentOptionId={reason}
				onSelection={setReason}
			/>
			<Dropdown
				index={3}
				placeholder="Duration"
				options={Object.values(ModerationPresetDuration).map(value => ({ id: value, name: ModerationPresetDurationStrings[value] }))}
				currentOptionId={duration}
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

function Actions({ report }: {
	report: Report,
}) {
	const [ dialogOpen, setDialogOpen ] = React.useState(false)

	return (
		<ActionsElement>
			<AcceptActionElement onClick={() => setDialogOpen(true)}>
				<AcceptIconElement />
				{
					dialogOpen ? (
						<ReportAcceptDialog
							report={report}
							onClose={() => setDialogOpen(false)}
						/>
					) : null
				}
			</AcceptActionElement>

			<DeclineActionElement onClick={() => report.decline(API)}>
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