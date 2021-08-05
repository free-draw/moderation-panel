import axios from "axios"

import Resource from "/src/class/Resource"

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

const ModeratorResource = new Resource(async (batch) => {
	const moderators = await Promise.all(
		Object.values(batch).map(async (moderatorId) => {
			const response = await axios(`/api/moderators/${moderatorId}`)
			return new Moderator(response.data.moderator)
		})
	)

	const results = {}
	moderators.forEach((moderator) => {
		results[moderator.id] = moderator
	})
	return results
})

export const getModerator = ModeratorResource.createInvoker()