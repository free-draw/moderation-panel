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
	[ModerationPresetDuration.THREE_DAYS]: ms("3d") / 1000,
	[ModerationPresetDuration.ONE_WEEK]: ms("7d") / 1000,
	[ModerationPresetDuration.TWO_WEEKS]: ms("2w") / 1000,
	[ModerationPresetDuration.FOUR_WEEKS]: ms("4w") / 1000,
	[ModerationPresetDuration.TWELVE_WEEKS]: ms("12w") / 1000,
	[ModerationPresetDuration.TWENTY_FOUR_WEEKS]: ms("24w") / 1000,
	[ModerationPresetDuration.ONE_YEAR]: ms("1y") / 1000,
	[ModerationPresetDuration.FOREVER]: null,
} as Record<ModerationPresetDuration, number | null>