import React from "react"
import styled from "styled-components"
import { useHistory } from "react-router-dom"
import { mdiMagnify, mdiTrashCanOutline, mdiPlus } from "@mdi/js"
import API from "../../API"
import ModerationPresetReason from "../../types/enum/ModerationPresetReason"
import ModerationPresetDuration from "../../types/enum/ModerationPresetDuration"
import colors from "../../assets/colors"
import IconButtonComponent from "../../components/IconButton"
import DialogComponent from "../../components/Dialog"
import DropdownComponent from "../../components/Dropdown"
import TextAreaComponent from "../../components/TextArea"
import Realtime from "../../Realtime"
import ContentSection, { ContentSectionStatus } from "./ContentSection"
import { User, Action, ActionOptions, UserResolvable, ActionType } from "@free-draw/moderation-client"
import ButtonStyle from "../../types/enum/ButtonStyle"
import FieldComponent from "../../components/fields/Field"
import FieldGroupComponent from "../../components/fields/FieldGroup"
import { ModerationPresetReasonStrings } from "../../types/enum/data/ModerationPresetReasonData"
import { ModerationPresetDurationLengths, ModerationPresetDurationStrings } from "../../types/enum/data/ModerationPresetDurationData"
import { ActionTypeStrings } from "../../types/enum/data/ActionTypeData"

export const NotesTextAreaElement = styled(TextAreaComponent)`
	height: 150px;
`

function CreateDialog({ onCreate, onClose }: {
	onCreate: (options: ActionOptions) => void,
	onClose: () => void,
}) {
	const [ type, setType ] = React.useState<ActionType | null>(null)
	const [ reason, setReason ] = React.useState<ModerationPresetReason | null>(null)
	const [ duration, setDuration ] = React.useState<ModerationPresetDuration | null>(null)
	const [ notes, setNotes ] = React.useState("")

	return (
		<DialogComponent
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
					style: ButtonStyle.FILLED,
					onClick() {
						if (type && reason && duration) {
							onCreate({
								type,
								reason: ModerationPresetReasonStrings[reason!],
								duration: duration && duration !== ModerationPresetDuration.FOREVER ? ModerationPresetDurationLengths[duration]! : undefined,
								notes,
							})
							onClose()
						}
					},
				},
			]}
			onCancel={onClose}
		>
			<DropdownComponent
				placeholder="Type"
				options={Object.values(ActionType).map((value: ActionType) => {
					return {
						id: value,
						name: ActionTypeStrings[value],
					}
				})}
				currentOptionId={type}
				onSelection={setType}
				index={1}
			/>
			<DropdownComponent
				placeholder="Reason"
				options={Object.values(ModerationPresetReason).map((value: ModerationPresetReason) => {
					return {
						id: value,
						name: ModerationPresetReasonStrings[value],
					}
				})}
				currentOptionId={reason}
				onSelection={setReason}
				index={2}
			/>
			<DropdownComponent
				placeholder="Duration"
				options={Object.values(ModerationPresetDuration).map((value: ModerationPresetDuration) => {
					return {
						id: value,
						name: ModerationPresetDurationStrings[value],
					}
				})}
				currentOptionId={duration}
				onSelection={setDuration}
				index={3}
			/>
			<NotesTextAreaElement
				placeholder="Notes"
				onChange={event => setNotes(event.target.value)}
			/>
		</DialogComponent>
	)
}

function DeleteDialog({ action, onDelete, onClose }: {
	action: Action,
	onDelete: () => void,
	onClose: () => void,
}) {
	return (
		<DialogComponent
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
					style: ButtonStyle.FILLED,
					onClick: onDelete,
				},
			]}
			onCancel={onClose}
		/>
	)
}

export const ActionElement = styled.div<{
	isEnabled: boolean,
	isExpanded: boolean,
}>`
	border: 1px solid ${props => props.isExpanded ? colors.brand[600] : colors.border};
	border-radius: 8px;
	padding: 16px;
	display: flex;
	flex-direction: column;
	user-select: none;
	cursor: pointer;
	opacity: ${props => props.isEnabled || props.isExpanded ? "100%" : "50%"};

	${props => props.isEnabled ? "" : "filter: grayscale(100%)"};

	& + & {
		margin-top: 8px;
	}
`

export const ActionDetailsElement = styled.div`
	position: relative;
`

export const ActionTextElement = styled.div`
	display: flex;
	flex-direction: column;
`

export const ActionReasonElement = styled.span`
	font-size: 18px;
	font-weight: 600;
	color: ${colors.brand[600]};
`

export const ActionTypeElement = styled.span`
	font-size: 14px;
	font-weight: 400;
	letter-spacing: 1px;
	text-transform: uppercase;
	margin-top: 6px;
`

export const ActionExtendedDetailsElement = styled.div<{
	isExpanded: boolean,
}>`
	display: ${props => props.isExpanded ? "flex" : "none"};
	margin-top: 16px;
`

export const ActionButtonsElement = styled.div`
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

export enum ModeratorState {
	LOADED = "LOADED",
	LOADING = "LOADING",
	UNKNOWN = "UNKNOWN",
}

const ActionsItemComponent = ({ action }: {
	action: Action,
}) => {
	const history = useHistory()

	const [ expanded, setExpanded ] = React.useState(false)
	const [ prompt, setPrompt ] = React.useState(false)

	const [ moderatorName, setModeratorName ] = React.useState<string | null>(null)
	const [ moderatorState, setModeratorState ] = React.useState<ModeratorState>(action.moderator ? ModeratorState.LOADING : ModeratorState.UNKNOWN)

	React.useEffect(() => {
		if (action.moderator) {
			action.moderator.resolve(API).then((moderator) => {
				setModeratorName(moderator.name)
				setModeratorState(ModeratorState.LOADED)
			})
		} else {
			setModeratorState(ModeratorState.UNKNOWN)
		}
	}, [ action.moderator ])

	return (
		<ActionElement
			isEnabled={action.active}
			isExpanded={expanded}
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
							<IconButtonComponent
								icon={mdiMagnify}
								onClick={() => history.push(action.report ? `/reports/${action.report.id}` : `/snapshots/${action.snapshot!.id}`)}
							/>
						) : null
					}
					<>
						{
							action.active ? (
								<IconButtonComponent
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
			<ActionExtendedDetailsElement isExpanded={expanded}>
				<FieldGroupComponent>
					<FieldComponent
						name="Notes"
						value={action.notes ?? "No notes specified"}
						isEmpty={!action.notes}
					/>
					<FieldComponent
						name="Moderator"
						value={moderatorName ?? "Unknown"}
						isEmpty={moderatorState === "UNKNOWN"}
						isInline
					/>
					<FieldComponent
						name="Created"
						value={action.created.toLocaleString()}
						isInline
					/>
					{
						action.expiry ? (
							<FieldComponent
								name="Expiry"
								value={action.expiry.toLocaleString()}
								isInline
							/>
						) : null
					}
				</FieldGroupComponent>
			</ActionExtendedDetailsElement>
		</ActionElement>
	)
}

const ActionsComponent = ({ user }: {
	user: User,
}) => {
	const [ actions, setActions ] = React.useState(user.actions)
	const [ dialogOpen, setDialogOpen ] = React.useState(false)

	React.useEffect(() => {
		const onActionCreate = (actionUser: UserResolvable, action: Action) => {
			if (actionUser.id === user.id) {
				setActions([ ...actions, action ])
			}
		}

		const onActionDelete = (actionUser: UserResolvable, action: Action) => {
			if (actionUser.id === user.id) {
				setActions([
					...actions.filter(filterAction => filterAction.id !== action.id),
					action,
				])
			}
		}

		Realtime.on("actionCreate", onActionCreate)
		Realtime.on("actionDelete", onActionDelete)

		return () => {
			Realtime.off("actionCreate", onActionCreate)
			Realtime.off("actionDelete", onActionDelete)
		}
	}, [ user, actions ])

	let status: ContentSectionStatus
	if (actions && actions.length > 0) {
		status = ContentSectionStatus.LOADED
	} else if (actions) {
		status = ContentSectionStatus.EMPTY
	} else {
		status = ContentSectionStatus.LOADING
	}

	return (
		<>
			<ContentSection
				name="Actions"
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
							.map(action => <ActionsItemComponent key={action.id} action={action} />)
					) : undefined
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
				) : undefined
			}
		</>
	)
}

export default ActionsComponent