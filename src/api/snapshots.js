import axios from "axios"

import { getRobloxUser } from "./roblox"
import { parse } from "/src/util/saveFormat"

class Player {
	constructor(data) {
		this.id = data.id
		this.name = data.name
		this.displayName = data.displayName
	}
}

class Snapshot {
	constructor(data) {
		this.players = null
		this.logs = null
		this.canvas = null

		this._data = data
	}

	async initialize() {
		const data = this._data

		const players = await Promise.all(data.players.map(getRobloxUser))
		const playersMap = {}
		players.forEach((playerData) => {
			playersMap[playerData.id] = new Player(playerData)
		})

		this.players = playersMap
		this.logs = data.logs.map((logData) => {
			return {
				player: playersMap[logData.userId],
				message: logData.message,
			}
		})
		this.canvas = data.canvas.map((canvasData) => {
			const buffer = Uint8Array.from(atob(canvasData.data), character => character.charCodeAt(0))
			const data = parse(buffer)

			return { player: playersMap[canvasData.userId], ...data }
		})
	}
}

export async function getSnapshot(snapshotId) {
	const response = await axios.get(`/api/snapshots/${snapshotId}`)
	return new Snapshot(response.data.snapshot)
}