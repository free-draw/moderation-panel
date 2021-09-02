import axios from "axios"

import { getModerator } from "/src/api/moderators"
import { getRobloxUser } from "/src/api/roblox"

const genericFetchLogDataTypes = {
	async action(data) {
		return Object.assign({}, data, {
			user: await getRobloxUser(data.userId),
		})
	},

	async noop(data) {
		return data
	},
}

const fetchLogDataTypes = {
	CREATE_ACTION: genericFetchLogDataTypes.action,
	DISCARD_ACTION_BY_ID: genericFetchLogDataTypes.action,
	DISCARD_ACTION_BY_TYPE: genericFetchLogDataTypes.action,

	CREATE_MODERATOR: genericFetchLogDataTypes.noop,
	DELETE_MODERATOR: genericFetchLogDataTypes.noop,
	CREATE_MODERATOR_ACCOUNT: genericFetchLogDataTypes.noop,
	DELETE_MODERATOR_ACCOUNT: genericFetchLogDataTypes.noop,
	UPDATE_MODERATOR: genericFetchLogDataTypes.noop,

	ACCEPT_REPORT: genericFetchLogDataTypes.noop,
	DECLINE_REPORT: genericFetchLogDataTypes.noop,
}

function parseLog(logData) {
	return {
		time: new Date(logData.time),
		type: logData.type,
		source: logData.source,
		data: logData.data,
	}
}

function asyncMap(array, callback) {
	return Promise.all(array.map(callback))
}

class LogsPage {
	constructor(pageData) {
		this.index = pageData.index
		this.logs = pageData.logs.map(parseLog)
		this._previousPageCursor = pageData.previousPageCursor
		this._nextPageCursor = pageData.nextPageCursor
	}

	async fetchData() {
		this.logs = await asyncMap(this.logs, async (logData) => {
			const fetchLogData = fetchLogDataTypes[logData.type]

			const [ source, data ] = await Promise.all([
				getModerator(logData.source),
				fetchLogData(logData.data),
			])

			return Object.assign({}, logData, { source, data })
		})
	}

	next() {
		return getLogs({
			cursor: this._nextPageCursor,
		})
	}

	previous() {
		return getLogs({
			cursor: this._nextPageCursor,
		})
	}
}

export async function getLogs(options, shouldFetchData) {
	let response

	if (options) {
		const query = new URLSearchParams(options)
		response = await axios(`/api/logs?${query.toString()}`)
	} else {
		response = await axios("/api/logs")
	}

	const page = new LogsPage(response.data)

	if (shouldFetchData !== false) {
		await page.fetchData()
	}

	return page
}