import Enumerable from "/src/class/Enumerable"

import ms from "ms"

const ModerationPresetDuration = new Enumerable("ModerationPresetDuration", {
	THREE_DAYS: { name: "3 days", duration: ms("3d") },
	ONE_WEEK: { name: "1 week", duration: ms("1w") },
	TWO_WEEKS: { name: "2 weeks", duration: ms("2w") },
	FOUR_WEEKS: { name: "1 month", duration: ms("4w") },
	TWELVE_WEEKS: { name: "3 months", duration: ms("12w") },
	TWENTY_FOUR_WEEKS: { name: "6 months", duration: ms("24w")},
	ONE_YEAR: { name: "1 year", duration: ms("1y") },
	FOREVER: { name: "Forever" },
})

export default ModerationPresetDuration