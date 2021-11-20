import { ActionType } from "@free-draw/moderation-client"

export const ActionTypeStrings = {
	[ActionType.BAN]: "Ban",
	[ActionType.MUTE]: "Mute",
	[ActionType.DRAWBAN]: "Draw-ban",
	[ActionType.WARN]: "Warn",
} as Record<ActionType, string>