import ms from "ms"
import ModerationPresetDuration from "../ModerationPresetDuration"

export const ModerationPresetDurationStrings = {
	[ModerationPresetDuration.THREE_DAYS]: "3 days",
	[ModerationPresetDuration.ONE_WEEK]: "1 week",
	[ModerationPresetDuration.TWO_WEEKS]: "2 weeks",
	[ModerationPresetDuration.FOUR_WEEKS]: "1 month",
	[ModerationPresetDuration.TWELVE_WEEKS]: "3 months",
	[ModerationPresetDuration.TWENTY_FOUR_WEEKS]: "6 months",
	[ModerationPresetDuration.ONE_YEAR]: "1 year",
	[ModerationPresetDuration.FOREVER]: "Forever",
} as Record<ModerationPresetDuration, string>

export const ModerationPresetDurationLengths = {
	[ModerationPresetDuration.THREE_DAYS]: ms("3d"),
	[ModerationPresetDuration.ONE_WEEK]: ms("7d"),
	[ModerationPresetDuration.TWO_WEEKS]: ms("2w"),
	[ModerationPresetDuration.FOUR_WEEKS]: ms("4w"),
	[ModerationPresetDuration.TWELVE_WEEKS]: ms("12w"),
	[ModerationPresetDuration.TWENTY_FOUR_WEEKS]: ms("24w"),
	[ModerationPresetDuration.ONE_YEAR]: ms("1y"),
	[ModerationPresetDuration.FOREVER]: null,
} as Record<ModerationPresetDuration, number | null>