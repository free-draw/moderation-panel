import React from "react"
import { useHistory } from "react-router-dom"
import { mdiMagnify, mdiTrashCanOutline } from "@mdi/js"

import useAsync from "/src/util/useAsync"
import makeClassName from "/src/util/makeClassName"

import { getRobloxUser, getRobloxThumbnail } from "/src/api/roblox"
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

function Action(props) {
	const { action } = props

	const [ expanded, setExpanded ] = React.useState(false)
	const [ prompt, setPrompt ] = React.useState(false)

	const history = useHistory()

	return (
		<div className={makeClassName("action", { inactive: !action.active, expanded })} onClick={() => setExpanded(!expanded)}>
			<div className="primary-details">
				<div className="primary-text">
					<span className="action-reason">{action.reason}</span>
					<span className="action-type">{action.type}</span>
				</div>
				<div className="buttons">
					{
						props.active && action.report ? (
							<IconButton
								icon={mdiMagnify}
								onClick={() => history.push(`/reports/${action.report}`)}
							/>
						) : null
					}
					<>
						<IconButton icon={mdiTrashCanOutline} onClick={() => setPrompt(true)} />
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
				<div className="field full">
					<span className="field-name">Notes</span>
					<span className={makeClassName("field-value", { empty: !action.notes })}>
						{action.notes ?? "No notes specified"}
					</span>
				</div>
				<div className="field">
					<span className="field-name">Moderator</span>
					<span className="field-value">
						[TODO]
					</span>
				</div>
				<div className="field">
					<span className="field-name">Time</span>
					<span className="field-value">
						{action.timestamp.toLocaleString()}
					</span>
				</div>
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