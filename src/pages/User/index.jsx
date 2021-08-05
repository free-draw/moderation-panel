import React from "react"
import { useHistory } from "react-router-dom"
import { mdiMagnify, mdiTrashCanOutline } from "@mdi/js"

import useAsync from "/src/util/useAsync"
import makeClassName from "/src/util/makeClassName"

import { getRobloxUser, getRobloxThumbnail } from "/src/api/roblox"
import { getModerator } from "/src/api/moderators"
import { getUser } from "/src/api/users"

import Page from "/src/components/Page"
import Spinner from "/src/components/Spinner"
import IconButton from "/src/components/IconButton"
import Dialog from "/src/components/Dialog"

import "./style.scss"

function ActionDeleteDialog(props) {
	return (
		<Dialog
			title="Delete action?"
			description={`You're about to delete this ${props.action.type}. This is permanent.`}
			buttons={[
				{
					id: "cancel",
					text: "Cancel",
					onClick: props.onClose,
				},
				{
					id: "confirm",
					text: "Delete",
					style: "filled",
					onClick: props.onDelete,
				},
			]}
			onCancel={props.onClose}
		/>
	)
}

function ActionField(props) {
	return (
		<div className={makeClassName("field", { inline: props.inline })}>
			<span className="field-name">{props.name}</span>
			<span className={makeClassName("field-value", { empty: props.empty })}>
				{props.value}
			</span>
		</div>
	)
}

function Action(props) {
	const { action } = props
	const history = useHistory()

	const [ expanded, setExpanded ] = React.useState(false)
	const [ prompt, setPrompt ] = React.useState(false)

	const moderator = useAsync(getModerator, !action.moderator || !expanded)(action.moderator)
	const moderatorName = action.moderator ? (moderator ? moderator.name : "Loading...") : "Unknown"
	const moderatorNameLoaded = action.moderator && moderator

	return (
		<div className={makeClassName("action", { inactive: !action.active, expanded })} onClick={() => setExpanded(!expanded)}>
			<div className="primary-details">
				<div className="primary-text">
					<span className="action-reason">{action.reason}</span>
					<span className="action-type">{action.type}</span>
				</div>
				<div className="buttons">
					{
						action.report ? (
							<IconButton
								icon={mdiMagnify}
								onClick={() => history.push(`/reports/${action.report}`)}
							/>
						) : null
					}
					<>
						{
							props.active ? (
								<IconButton
									icon={mdiTrashCanOutline}
									onClick={() => setPrompt(true)}
								/>
							) : null
						}
						{
							prompt ? (
								<ActionDeleteDialog
									action={action}
									onDelete={() => {
										setPrompt(false)
										action.delete()
									}}
									onClose={() => setPrompt(false)}
								/>
							) : null
						}
					</>
				</div>
			</div>
			<div className="secondary-details">
				<ActionField
					name="Notes"
					value={action.notes ?? "No notes specified"}
					empty={!action.notes}
				/>
				<ActionField
					name="Moderator"
					value={moderatorName}
					empty={!moderatorNameLoaded}
					inline
				/>
				<ActionField
					name="Time"
					value={action.timestamp.toLocaleString()}
					inline
				/>
				{
					action.expiry ? (
						<ActionField
							name="Expiry"
							value={action.expiry.toLocaleString()}
							inline
						/>
					) : null
				}
			</div>
		</div>
	)
}

function UserPage(props) {
	const { userId } = props.match.params

	const details = useAsync(getRobloxUser)(userId)
	const avatar = useAsync(getRobloxThumbnail)("AvatarHeadShot", userId, "420x420")
	const user = useAsync(getUser)(userId)

	let actions
	if (user) {
		actions = [].concat(user.actions, user.history)
		actions.sort((B, A) => A.timestamp.getTime() - B.timestamp.getTime())
		actions = actions.map(action => <Action key={action.id} action={action} />)
	}

	return (
		<Page name="user">
			<div className={makeClassName("details", { loading: !details })}>
				{
					details ? (
						<>
							<div className="avatar-container">
								{
									avatar ? (
										<img className="avatar" src={avatar} />
									) : <Spinner />
								}
							</div>
							<span className="username">{details.name}</span>
							<a className="profile-url" target="_blank" href={`https://www.roblox.com/users/${userId}/profile`}>Go to Roblox profile</a>
						</>
					) : <Spinner />
				}
			</div>
			<div className="content">
				<div className="content-section">
					<span className="content-header">Actions</span>
					<div className={makeClassName("content-container actions", { loading: !user })}>
						{actions ?? <Spinner />}
					</div>
				</div>
			</div>
		</Page>
	)
}

export default UserPage