import Enumerable from "/src/class/Enumerable"

const ModerationPresetReason = new Enumerable("ModerationPresetReason", {
	GRIEFING: "Griefing",
	NSFW: "NSFW",
	SCRIBBLING: "Scribbling",
	HARASSMENT: "Harassment",
	EXPLOITS: "Exploits",
	FALSE_VOTEKICKING: "False vote-kicking",
	PROFANITY: "Profanity/swearing",
	HATE_SPEECH: "Hate speech",
	OTHER: "Other",
})

export default ModerationPresetReason