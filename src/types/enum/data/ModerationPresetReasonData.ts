import ModerationPresetReason from "../ModerationPresetReason"

export const ModerationPresetReasonStrings = {
	[ModerationPresetReason.GRIEFING]: "Griefing",
	[ModerationPresetReason.NSFW]: "NSFW",
	[ModerationPresetReason.SCRIBBLING]: "Scribbling",
	[ModerationPresetReason.HARASSMENT]: "Harassment",
	[ModerationPresetReason.EXPLOITS]: "Exploits",
	[ModerationPresetReason.FALSE_VOTEKICKING]: "False vote-kicking",
	[ModerationPresetReason.PROFANITY]: "Profanity",
	[ModerationPresetReason.HATE_SPEECH]: "Hate speech",
	[ModerationPresetReason.OTHER]: "Other",
} as Record<ModerationPresetReason, string>