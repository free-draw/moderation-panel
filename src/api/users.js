import axios from "axios"

class Action {
	constructor(user, data, active) {
		this.user = user

		this.id = data.id
		this.type = data.type
		this.data = data.data
		this.expiry = data.expiry ? new Date(data.expiry) : null
		this.reason = data.reason
		this.snapshot = data.snapshot
		this.report = data.report
		this.moderator = data.moderator
		this.timestamp = new Date(data.timestamp)

		this.active = active
	}

	async delete() {
		await axios.delete(`/api/users/${this.user.id}/action/${this.id}`)
		this.user.actions = this.user.actions.filter(action => action !== this)
	}
}

class User {
	constructor(data) {
		this.id = data.userId
		this.actions = data.actions.map(actionData => new Action(this, actionData, true))
		this.history = data.history.map(actionData => new Action(this, actionData, false))
	}

	async issueAction(data) {
		const response = await axios.post()
		const action = new Action(this, Object.assign({}, data, {
			id: response.data.actionId,
		}), true)
		this.actions.push(action)
		return action
	}

	async deleteActionsByType(type) {
		const response = await axios.delete(`/api/users/${this.userId}/type/${type}`)
		this.actions = this.actions.filter(action => action.type !== type)
		return response.data.discardedActions.map(actionData => new Action(this, actionData, false))
	}
}

export async function getUser(userId) {
	const response = await axios.get(`/api/users/${userId}`)
	return new User(response.data.user)
}

export async function getUsersBulk(userIds) {
	const response = await axios.post("/api/users", userIds.map(parseInt))
	return response.data.users.map(data => new User(data))
}