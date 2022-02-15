import React from "react"
import styled from "styled-components"
import API from "../../../API"
import { ActionType, Report } from "@free-draw/moderation-client"
import ModerationPresetReason from "../../../types/enum/ModerationPresetReason"
import ModerationPresetDuration from "../../../types/enum/ModerationPresetDuration"
import DialogComponent from "../../../components/Dialog"
import DropdownComponent from "../../../components/Dropdown"
import AcceptIcon from "./accept-icon.svg"
import DeclineIcon from "./decline-icon.svg"
import colors from "../../../assets/colors"
import ButtonStyle from "../../../types/enum/ButtonStyle"
import { ModerationPresetDurationLengths, ModerationPresetDurationStrings } from "../../../types/enum/data/ModerationPresetDurationData"
import { ModerationPresetReasonStrings } from "../../../types/enum/data/ModerationPresetReasonData"
import { ActionTypeStrings } from "../../../types/enum/data/ActionTypeData"

const ReportAcceptDialogComponent = ({ report, onClose }: {
	report: Report,
	onClose: () => void,
}) => {
	const [ type, setType ] = React.useState<ActionType | null>(null)
	const [ reason, setReason ] = React.useState<ModerationPresetReason | null>(null)
	const [ duration, setDuration ] = React.useState<ModerationPresetDuration | null>(null)

	return (
		<DialogComponent
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
								duration: duration && duration !== ModerationPresetDuration.FOREVER ? ModerationPresetDurationLengths[duration]! : undefined,
							})

							onClose()
						}
					},
				},
			]}
			onCancel={onClose}
		>
			<DropdownComponent
				index={1}
				placeholder="Type"
				options={Object.values(ActionType).map((value) => {
					return {
						id: value,
						name: ActionTypeStrings[value],
					}
				})}
				currentOptionId={type}
				onSelection={setType}
			/>
			<DropdownComponent
				index={2}
				placeholder="Reason"
				options={Object.values(ModerationPresetReason).map((value) => {
					return {
						id: value,
						name: ModerationPresetReasonStrings[value],
					}
				})}
				currentOptionId={reason}
				onSelection={setReason}
			/>
			<DropdownComponent
				index={3}
				placeholder="Duration"
				options={Object.values(ModerationPresetDuration).map((value) => {
					return {
						id: value,
						name: ModerationPresetDurationStrings[value],
					}
				})}
				currentOptionId={duration}
				onSelection={setDuration}
			/>
		</DialogComponent>
	)
}

export const ActionsElement = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	pointer-events: none;
	position: absolute;
	bottom: 60px;
	width: 100%;
	z-index: 10;
`

export const ActionElement = styled.div`
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

export const AcceptActionElement = styled(ActionElement).attrs({
	color: colors.brand[600],
})``

export const AcceptIconElement = styled(AcceptIcon)`
	width: 35px;
	height: 26px;
`

export const DeclineActionElement = styled(ActionElement).attrs({
	color: "#d81b60",
})``

export const DeclineIconElement = styled(DeclineIcon)`
	width: 30px;
	height: 30px;
`

const ActionsComponent = ({ report }: {
	report: Report,
}) => {
	const [ dialogOpen, setDialogOpen ] = React.useState(false)

	return (
		<ActionsElement>
			<AcceptActionElement onClick={() => setDialogOpen(true)}>
				<AcceptIconElement />
				{
					dialogOpen ? (
						<ReportAcceptDialogComponent
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

export default ActionsComponent