import React from "react"
import styled from "styled-components"
import { Link, useHistory } from "react-router-dom"

import colors from "/src/presets/colors"

const actionTypes = {
	BAN: "ban",
	DRAWBAN: "drawban",
	MUTE: "mute",
}

const accountTypes = {
	ROBLOX: "Roblox",
	DISCORD: "Discord",
}

const indicatorColors = {
	create: "#43a047",
	delete: "#d81b60",
	modify: "#9c27b0",

	accept: "#43a047",
	decline: "#d81b60",
}

/* FIELDS */

function useField(name, value, inline) {
	return {
		name: name,
		value: value ?? "N/A",
		inline: inline ?? true,
		empty: !value,
	}
}

const LinkElement = styled(Link)`
	color: ${colors.brand[600]};
	font-weight: 600;
`

function useLinkField(name, path, text, inline) {
	return useField(name, <LinkElement to={path}>{text}</LinkElement>, inline)
}

const ExternalLinkElement = styled.a.attrs({
	target: "_blank",
})`
	color: ${colors.brand[600]};
	font-weight: 600;
`

function useExternalLinkField(name, url, text, inline) {
	return useField(name, <ExternalLinkElement href={url}>{text ?? url}</ExternalLinkElement>, inline)
}

function useUserField(name, user, inline) {
	return useLinkField(name, `/users/${user.id}`, user.name, inline)
}

/* BUTTONS */

function useLinkButton({ id, text, style }, path) {
	const history = useHistory()

	return {
		id,
		text,
		style,
		onClick: () => {
			history.push(path)
		},
	}
}

function useViewSnapshotButton(snapshotId) {
	return useLinkButton({
		id: "view",
		text: "View Snapshot",
		style: "filled",
	}, `/snapshots/${snapshotId}`)
}

function useViewReportButton(reportId) {
	return useLinkButton({
		id: "view",
		text: "View Report",
		style: "filled",
	}, `/reports/${reportId}`)
}

/* LOG TYPES */

export const CREATE_ACTION = ({ log, source }) => {
	const { action, user } = log.data

	return {
		color: indicatorColors.create,
		text: <> {source} created a <em>{actionTypes[action.type]}</em> on <em>{user.name}</em> </>,
		fields: [
			useUserField("User", user),
			useField("Type", action.type),
			useField("Reason", action.reason),
			useField("Notes", action.notes),
			useField("Expires at", action.expiry ? action.expiry.toLocaleString() : null),
		],
		buttons: [
			action.snapshot ? useViewSnapshotButton(action.snapshot) : null,
		],
	}
}
export const DISCARD_ACTION_BY_ID = ({ log, source }) => {
	const { action, user } = log.data

	return {
		color: indicatorColors.delete,
		text: <> {source} removed a <em>{actionTypes[action.type]}</em> on <em>{user.name}</em> </>,
		fields: [
			useUserField("User", user),
			useField("Type", action.type),
			useField("Reason", action.reason),
		],
		buttons: [],
	}
}
export const DISCARD_ACTION_BY_TYPE = DISCARD_ACTION_BY_ID

export const CREATE_MODERATOR = ({ log, source }) => {
	const { moderator } = log.data

	return {
		color: indicatorColors.create,
		text: <> {source} created moderator <em>{moderator.name}</em> </>,
		fields: [
			useField("Name", moderator.name),
			useField("Permissions", moderator.permissions.join(", "), false),
		],
		buttons: [],
	}
}
export const DELETE_MODERATOR = ({ log, source }) => {
	const { moderator } = log.data

	return {
		color: indicatorColors.delete,
		text: <> {source} deleted moderator <em>{moderator.name}</em> </>,
		fields: [
			useField("Name", moderator.name),
		],
		buttons: [],
	}
}
export const CREATE_MODERATOR_ACCOUNT = ({ log, source }) => {
	const { moderator, account } = log.data

	return {
		color: indicatorColors.create,
		text: <> {source} linked a <em>{accountTypes[account.type]}</em> account to <em>{moderator.name}</em> </>,
		fields: [
			useField("Type", account.type),
			useField("ID", account.id),
		],
		buttons: [],
	}
}
export const DELETE_MODERATOR_ACCOUNT = ({ log, source }) => {
	const { moderator, account } = log.data

	return {
		color: indicatorColors.delete,
		text: <> {source} unlinked a <em>{accountTypes[account.type]}</em> account from <em>{moderator.name}</em> </>,
		fields: [
			useField("Type", account.type),
			useField("ID", account.id),
		],
		buttons: [],
	}
}
export const UPDATE_MODERATOR = ({ log, source }) => {
	const { moderator, changed } = log.data

	return {
		color: indicatorColors.modify,
		text: <> {source} updated moderator {moderator.name} </>,
		fields: [
			changed.name !== undefined ? useFIeld("Name", changed.name) : null,
			changed.permissions !== undefined ? useFIeld("Permissions", changed.permissions) : null,
			changed.enabled !== undefined ? useFIeld("Enabled", changed.enabled ? "Yes" : "No") : null,
		],
		buttons: [],
	}
}

export const ACCEPT_REPORT = ({ log, source }) => {
	const { report, action, from, target } = log.data

	return {
		color: indicatorColors.accept,
		text: <> {source} accepted report of user <em>{target.name}</em> from <em>{from.name}</em> </>,
		fields: [
			useUserField("From", from),
			useUserField("Target", target),
			useField("Type", action.type),
			useField("Reason", action.reason),
			useField("Expires at", action.expiry ? action.expiry.toLocaleString() : null),
		],
		buttons: [
			useViewReportButton(report.id),
		],
	}
}
export const DECLINE_REPORT = ({ log, source }) => {
	const { report, from, target } = log.data

	return {
		color: indicatorColors.accept,
		text: <> {source} accepted report of user <em>{target.name}</em> from <em>{from.name}</em> </>,
		fields: [
			useUserField("From", from),
			useUserField("Target", target),
		],
		buttons: [
			useViewReportButton(report.id),
		],
	}
}