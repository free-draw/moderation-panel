import axios from "axios"

class ModeratorAccount {
	constructor(data) {
		this.type = data.type
		this.id = data.id
	}

	getUrl() {
		switch (data.type) {
			case "ROBLOX":
				return `https://www.roblox.com/users/${this.id}/profile`
			case "DISCORD":
				return ""
		}
	}
}

class Moderator {
	constructor(data) {
		this.id = data.id
		this.name = data.name
		this.accounts = data.accounts.map(accountData => new ModeratorAccount(accountData))
		this.enabled = data.enabled
		this.permissions = data.permissions
	}
}

export async function getModerator(moderatorId) {
	const response = await axios(`/api/moderators/${moderatorId}`)
	return new Moderator(response.data.moderator)
}