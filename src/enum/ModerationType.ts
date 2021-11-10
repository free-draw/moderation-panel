enum ModerationType {
	BAN = "BAN",
	DRAWBAN = "DRAWBAN",
	MUTE = "MUTE",
}

const ModerationTypeStrings = {
	[ModerationType.BAN]: "Ban",
	[ModerationType.DRAWBAN]: "Draw-ban",
	[ModerationType.MUTE]: "Mute",
}

export default ModerationType
export { ModerationTypeStrings }