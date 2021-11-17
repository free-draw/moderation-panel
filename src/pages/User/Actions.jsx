import React from "react"
import styled from "styled-components"
import { useHistory } from "react-router-dom"
import { mdiMagnify, mdiTrashCanOutline, mdiPlus } from "@mdi/js"
import Maid from "/src/class/Maid"
import API from "/src/API"
import ModerationType, { ModerationTypeStrings } from "/src/enum/ModerationType"
import ModerationPresetReason, { ModerationPresetReasonStrings } from "/src/enum/ModerationPresetReason"
import ModerationPresetDuration , { ModerationPresetDurationStrings, ModerationPresetDurationLengths } from "/src/enum/ModerationPresetDuration"
import colors from "/src/presets/colors"
import IconButton from "/src/components/IconButton"
import Dialog from "/src/components/Dialog"
import Dropdown from "/src/components/Dropdown"
import TextArea from "/src/components/TextArea"
import { Field, FieldGroup } from "/src/components/fields"
import Realtime from "/src/Realtime"

import ContentSection from "./ContentSection"

const NotesTextAreaElement = styled(TextArea)`
	height: 150px;
`

function CreateDialog({ onCreate, onClose }) {
	const [ type, setType ] = React.useState(null)
	const [ reason, setReason ] = React.useState(null)
	const [ duration, setDuration ] = React.useState(ModerationPresetDuration.FOREVER)
	const [ notes, setNotes ] = React.useState("")

	return (
		<Dialog
			title="Create action"
			buttons={[
				{
					id: "cancel",
					text: "Cancel",
					onClick: onClose,
				},
				{
					id: "create",
					text: "Create",
					style: "filled",
					onClick() {
						onCreate({
							type,
							reason: ModerationPresetReasonStrings[reason],
							duration: ModerationPresetDurationLengths[duration],
							notes,
						})

						onClose()
					},
				},
			]}
			onCancel={onClose}
		>
			<Dropdown
				placeholder="Type"
				options={Object.keys(ModerationType).map(key => ({ id: key, name: ModerationTypeStrings[key] }))}
				currentOptionId={type}
				onSelection={setType}
				index={1}
			/>
			<Dropdown
				placeholder="Reason"
				options={Object.keys(ModerationPresetReason).map(key => ({ id: key, name: ModerationPresetReasonStrings[key] }))}
				currentOptionId={reason}
				onSelection={setReason}
				index={2}
			/>
			<Dropdown
				placeholder="Duration"
				options={Object.keys(ModerationPresetDuration).map(key => ({ id: key, name: ModerationPresetDurationStrings[key] }))}
				currentOptionId={duration}
				onSelection={setDuration}
				index={3}
			/>
			<NotesTextAreaElement
				placeholder="Notes"
				onChange={event => setNotes(event.target.value)}
			/>
		</Dialog>
	)
}

function DeleteDialog({ action, onDelete, onClose }) {
	return (
		<Dialog
			title="Delete action?"
			description={`You're about to delete this ${action.type}. This is permanent.`}
			buttons={[
				{
					id: "cancel",
					text: "Cancel",
					onClick: onClose,
				},
				{
					id: "confirm",
					text: "Delete",
					style: "filled",
					onClick: onDelete,
				},
			]}
			onCancel={onClose}
		/>
	)
}

const ActionElement = styled.div`
	border: 1px solid ${props => props.expanded ? colors.brand[600] : colors.border};
	border-radius: 8px;
	padding: 16px;
	display: flex;
	flex-direction: column;
	user-select: none;
	cursor: pointer;
	opacity: ${props => props.enabled || props.expanded ? "100%" : "50%"};

	${props => props.enabled ? "" : "filter: grayscale(100%)"};

	& + & {
		margin-top: 8px;
	}
`

const ActionDetailsElement = styled.div`
	position: relative;
`

const ActionTextElement = styled.div`
	display: flex;
	flex-direction: column;
`

const ActionReasonElement = styled.span`
	font-size: 18px;
	font-weight: 600;
	color: ${colors.brand[600]};
`

const ActionTypeElement = styled.span`
	font-size: 14px;
	font-weight: 400;
	letter-spacing: 1px;
	text-transform: uppercase;
	margin-top: 6px;
`

const ActionExtendedDetailsElement = styled.div`
	display: ${props => props.expanded ? "flex" : "none"};
	margin-top: 16px;
`

const ActionButtonsElement = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	height: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	visibility: hidden;

	> * + * {
		margin-left: 6px;
	}

	${ActionElement}:hover & {
		visibility: visible;
	}
`

function Action({ action }) {
	const history = useHistory()

	const [ expanded, setExpanded ] = React.useState(false)
	const [ prompt, setPrompt ] = React.useState(false)

	const [ moderatorName, setModeratorName ] = React.useState(null)
	const [ moderatorState, setModeratorState ] = React.useState(action.moderator ? "LOADING" : "UNKNOWN")

	React.useEffect(() => {
		if (action.moderator) {
			action.moderator.resolve(API).then((moderator) => {
				setModeratorName(moderator.name)
				setModeratorState("LOADED")
			})
		} else {
			setModeratorState("UNKNOWN")
		}
	}, [ action.moderator ])

	return (
		<ActionElement
			enabled={action.active}
			expanded={expanded}
			onClick={() => setExpanded(!expanded)}
		>
			<ActionDetailsElement>
				<ActionTextElement>
					<ActionReasonElement>{action.reason}</ActionReasonElement>
					<ActionTypeElement>{action.type}</ActionTypeElement>
				</ActionTextElement>
				<ActionButtonsElement>
					{
						action.report || action.snapshot ? (
							<IconButton
								icon={mdiMagnify}
								onClick={() => history.push(action.report ? `/reports/${action.report.id}` : `/snapshots/${action.snapshot.id}`)}
							/>
						) : null
					}
					<>
						{
							action.active ? (
								<IconButton
									icon={mdiTrashCanOutline}
									onClick={() => setPrompt(true)}
								/>
							) : null
						}
						{
							prompt ? (
								<DeleteDialog
									action={action}
									onDelete={async () => {
										setPrompt(false)
										await action.delete(API)
									}}
									onClose={() => setPrompt(false)}
								/>
							) : null
						}
					</>
				</ActionButtonsElement>
			</ActionDetailsElement>
			<ActionExtendedDetailsElement expanded={expanded}>
				<FieldGroup>
					<Field
						name="Notes"
						value={action.notes ?? "No notes specified"}
						empty={!action.notes}
					/>
					<Field
						name="Moderator"
						value={moderatorName ?? "Unknown"}
						empty={moderatorState === "UNKNOWN"}
						inline
					/>
					<Field
						name="Created"
						value={action.created.toLocaleString()}
						inline
					/>
					{
						action.expiry ? (
							<Field
								name="Expiry"
								value={action.expiry.toLocaleString()}
								inline
							/>
						) : null
					}
				</FieldGroup>
			</ActionExtendedDetailsElement>
		</ActionElement>
	)
}

function Actions({ user }) {
	const [ actions, setActions ] = React.useState(user.actions)
	const [ dialogOpen, setDialogOpen ] = React.useState(false)

	React.useEffect(() => {
		const maid = new Maid()
		maid.listen(Realtime, "actionCreate", (actionUser, action) => {
			if (actionUser.id === user.id) {
				setActions([ ...actions, action ])
			}
		})
		maid.listen(Realtime, "actionDelete", (actionUser, action) => {
			if (actionUser.id === user.id) {
				setActions([
					...actions.filter(filterAction => filterAction.id !== action.id),
					action,
				])
			}
		})

		return () => maid.clean()
	}, [ user, actions ])

	let status
	if (actions && actions.length > 0) {
		status = "LOADED"
	} else if (actions) {
		status = "EMPTY"
	} else {
		status = "LOADING"
	}

	return (
		<>
			<ContentSection
				name="Actions"
				loading={!actions}
				status={status}
				buttons={[
					{
						id: "create",
						icon: mdiPlus,
						onClick: () => setDialogOpen(true),
					},
				]}
			>
				{
					actions && actions.length > 0 ? (
						[ ...actions ]
							.sort((B, A) => A.created.getTime() - B.created.getTime())
							.map(action => <Action key={action.id} action={action} />)
					) : null
				}
			</ContentSection>
			{
				dialogOpen ? (
					<CreateDialog
						onClose={() => setDialogOpen(false)}
						onCreate={(options) => {
							return user.createAction(API, options)
						}}
					/>
				) : null
			}
		</>
	)
}

export default Actions

export {
	ActionElement,

	ActionDetailsElement,
	ActionTextElement,
	ActionReasonElement,
	ActionTypeElement,

	ActionExtendedDetailsElement,
	ActionButtonsElement,
}