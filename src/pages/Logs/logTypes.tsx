import React from "react"
import styled from "styled-components"
import { Link, useHistory } from "react-router-dom"
import colors from "../../assets/colors"
import { LogType, LogTypeData, Report, RobloxUser, Snapshot, SnapshotResolvable } from "@free-draw/moderation-client"
import ButtonStyle from "../../types/enum/ButtonStyle"
import { ActionTypeStrings } from "../../types/enum/data/ActionTypeData"
import { AccountPlatformStrings } from "../../types/enum/data/AccountPlatformData"

/* FIELDS */

export type LogFieldOptions = {
	name: string,
	value: any,
	isInline: boolean,
	isEmpty?: boolean,
}

function useField(name: string, value?: any, isInline?: boolean): LogFieldOptions {
	return {
		name: name,
		value: value ?? "N/A",
		isInline: isInline ?? true,
		isEmpty: !value,
	}
}

const LinkElement = styled(Link)`
	color: ${colors.brand[600]};
	font-weight: 600;
`

function useLinkField(name: string, path: string, text?: any, inline?: boolean): LogFieldOptions {
	return useField(name, <LinkElement to={path}>{text}</LinkElement>, inline)
}

const ExternalLinkElement = styled.a.attrs({
	target: "_blank",
})`
	color: ${colors.brand[600]};
	font-weight: 600;
`

function useExternalLinkField(name: string, url: string, text?: any, inline?: boolean): LogFieldOptions {
	return useField(name, <ExternalLinkElement href={url}>{text ?? url}</ExternalLinkElement>, inline)
}

function useUserField(name: string, user: RobloxUser, inline?: boolean): LogFieldOptions {
	return useLinkField(name, `/users/${user.id}`, user.name, inline)
}

/* BUTTONS */

export type LogButtonOptions = {
	id: string,
	text: string,
	style?: ButtonStyle,
	onClick: () => void,
}

function useLinkButton({ id, text, style }: Omit<LogButtonOptions, "onClick">, path: string): LogButtonOptions {
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

function useViewSnapshotButton(snapshot: Snapshot | SnapshotResolvable): LogButtonOptions {
	return useLinkButton({
		id: "view",
		text: "View Snapshot",
		style: ButtonStyle.FILLED,
	}, `/snapshots/${snapshot.id}`)
}

function useViewReportButton(report: Report): LogButtonOptions {
	return useLinkButton({
		id: "view",
		text: "View Report",
		style: ButtonStyle.FILLED,
	}, `/reports/${report.id}`)
}

/* LOG TYPES */

export type LogTypeResult = {
	color: string,
	text: React.ReactNode,
	fields: LogFieldOptions[],
	buttons: LogButtonOptions[],
}

export default {
	[LogType.CREATE_ACTION]: ({ action, user }: LogTypeData[LogType.CREATE_ACTION], source) => {
		return {
			color: colors.logs.create,
			text: <> {source} created a <em>{ActionTypeStrings[action.type]}</em> on <em>{user.name}</em> </>,
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
	},

	[LogType.DELETE_ACTION]: ({ action, user }: LogTypeData[LogType.DELETE_ACTION], source) => {
		return {
			color: colors.logs.delete,
			text: <> {source} removed a <em>{ActionTypeStrings[action.type]}</em> on <em>{user.name}</em> </>,
			fields: [
				useUserField("User", user),
				useField("Type", action.type),
				useField("Reason", action.reason),
			],
			buttons: [],
		}
	},

	[LogType.DELETE_ACTIONS_BULK]: ({ actions, user }: LogTypeData[LogType.DELETE_ACTIONS_BULK], source) => {
		return {
			color: colors.logs.delete,
			text: <> {source} removed <em>{actions.length} action(s)</em> on <em>{user.name}</em> </>,
			fields: [
				useUserField("User", user),
			],
			buttons: [],
		}
	},

	[LogType.CREATE_MODERATOR]: ({ moderator }: LogTypeData[LogType.CREATE_MODERATOR], source) => {
		return {
			color: colors.logs.create,
			text: <> {source} created moderator <em>{moderator.name}</em> </>,
			fields: [
				useField("Name", moderator.name),
				useField("Permissions", moderator.permissions.join(", "), false),
			],
			buttons: [],
		}
	},

	[LogType.DELETE_MODERATOR]: ({ moderator }: LogTypeData[LogType.DELETE_MODERATOR], source) => {
		return {
			color: colors.logs.delete,
			text: <> {source} deleted moderator <em>{moderator.name}</em> </>,
			fields: [
				useField("Name", moderator.name),
			],
			buttons: [],
		}
	},

	[LogType.LINK_MODERATOR_ACCOUNT]: ({ moderator, account }: LogTypeData[LogType.LINK_MODERATOR_ACCOUNT], source) => {
		return {
			color: colors.logs.create,
			text: <> {source} linked a <em>{AccountPlatformStrings[account.platform]}</em> account to <em>{moderator.name}</em> </>,
			fields: [
				useField("Platform", account.platform),
				useField("ID", account.id),
			],
			buttons: [],
		}
	},

	[LogType.UNLINK_MODERATOR_ACCOUNT]: ({ moderator, account }: LogTypeData[LogType.UNLINK_MODERATOR_ACCOUNT], source) => {
		return {
			color: colors.logs.delete,
			text: <> {source} unlinked a <em>{AccountPlatformStrings[account.platform]}</em> account from <em>{moderator.name}</em> </>,
			fields: [
				useField("Platform", account.platform),
				useField("ID", account.id),
			],
			buttons: [],
		}
	},

	[LogType.UPDATE_MODERATOR]: ({ moderator, options }: LogTypeData[LogType.UPDATE_MODERATOR], source) => {
		return {
			color: colors.logs.modify,
			text: <> {source} updated moderator {moderator.name} </>,
			fields: [
				options.name !== undefined ? useField("Name", options.name) : null,
				options.permissions !== undefined ? useField("Permissions", options.permissions) : null,
				options.active !== undefined ? useField("Active", options.active ? "Yes" : "No") : null,
			],
			buttons: [],
		}
	},

	[LogType.ACCEPT_REPORT]: ({ action, report, from, target }: LogTypeData[LogType.ACCEPT_REPORT], source) => {
		return {
			color: colors.logs.accept,
			text: <> {source} accepted report of user <em>{target.name}</em> from <em>{from.name}</em> </>,
			fields: [
				useUserField("From", from),
				useUserField("Target", target),
				useField("Type", action.type),
				useField("Reason", action.reason),
				useField("Expires at", action.expiry ? action.expiry.toLocaleString() : null),
			],
			buttons: [
				useViewReportButton(report),
			],
		}
	},

	[LogType.DECLINE_REPORT]: ({ report, from, target }: LogTypeData[LogType.DECLINE_REPORT], source) => {
		return {
			color: colors.logs.decline,
			text: <> {source} declined report of user <em>{target.name}</em> from <em>{from.name}</em> </>,
			fields: [
				useUserField("From", from),
				useUserField("Target", target),
			],
			buttons: [
				useViewReportButton(report),
			],
		}
	},
} as Record<LogType, (data: LogTypeData[keyof LogTypeData], source: React.ReactNode) => LogTypeResult>