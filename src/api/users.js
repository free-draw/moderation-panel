import axios from "axios"
import EventEmitter from "eventemitter2"

class Action extends EventEmitter {
	constructor(user, data, active) {
		super()

		this.user = user

		this.id = data.id
		this.type = data.type
		this.data = data.data
		this.expiry = data.expiry ? new Date(data.expiry) : null
		this.reason = data.reason
		this.snapshot = data.snapshot
		this.report = data.report
		this.moderator = data.moderator ?? null
		this.timestamp = new Date(data.timestamp)

		this.active = active
	}

	async delete() {
		if (!this.active) {
			throw new Error("Action is already deleted")
		}

		await axios.delete(`/api/users/${this.user.id}/action/${this.id}`)

		this.user.actions = this.user.actions.filter(action => action !== this)
		this.user.history = [ ...this.user.history, this ]

		this.active = false
		this.emit("delete")
		this.user.emit("actionDelete", this)
	}
}

class User extends EventEmitter {
	constructor(data) {
		super()

		this.id = data.userId
		this.actions = data.actions.map(actionData => new Action(this, actionData, true))
		this.history = data.history.map(actionData => new Action(this, actionData, false))
	}

	async createAction(data) {
		const response = await axios.post(`/api/users/${this.id}/actions`, data)

		const action = new Action(this, {
			...data,
			id: response.data.actionId,
			expiry: data.duration ? new Date(Date.now() + data.duration * 1000) : data.expiry,
		}, true)
		this.actions = [ ...this.actions, action ]
		this.emit("actionCreate", action)

		return action
	}

	async deleteActionsByType(type) {
		await axios.delete(`/api/users/${this.id}/type/${type}`)

		const deletedActions = this.actions.filter(action => action.type === type)
		deletedActions.forEach(action => action.delete())

		return deletedActions
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