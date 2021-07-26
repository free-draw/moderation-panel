import axios from "axios"
import lodash from "lodash"

import { getRobloxUser } from "./roblox"
import { parse } from "/src/util/saveFormat"

import Vector2 from "/src/class/Vector2"

class Player {
	constructor(data) {
		this.id = data.id
		this.name = data.name
		this.displayName = data.displayName
		this.position = data.position ? new Vector2(data.position.x, data.position.y) : new Vector2(0, 0)
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

		const players = await Promise.all(data.players.map(async (playerData) => {
			const userData = await getRobloxUser(playerData.userId)

			return new Player({
				id: userData.id,
				name: userData.name,
				displayName: userData.displayName,
				position: playerData.position,
			})
		}))
		const playersMap = lodash.keyBy(players, "id")

		this.players = playersMap
		this.logs = data.logs.map((logData) => {
			return { 
				type: logData.type,
				player: playersMap[logData.userId],
				data: logData.data,
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