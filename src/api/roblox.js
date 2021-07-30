import axios from "axios"

import Resource from "/src/class/Resource"

const RobloxUserResource = new Resource(async (batch) => {
	const response = await axios.post("/api/roblox/users", {
		userIds: Object.values(batch),
		excludeBannedUsers: false,
	})

	const results = {}
	response.data.data.forEach((user) => {
		results[user.id] = user
	})
	return results
})

const RobloxUsernameResource = new Resource(async (batch) => {
	const response = await axios.post("/api/roblox/usernames", {
		usernames: Object.values(batch),
		excludeBannedUsers: false,
	})

	const results = {}
	response.data.data.forEach((user) => {
		results[user.requestedUsername] = user.id
	})
	return results
})

const RobloxThumbnailResource = new Resource(async (batch) => {
	const response = await axios.post("/api/roblox/thumbnails", Object.entries(batch).map(([ batchId, batchItem ]) => {
		return {
			requestId: batchId,
			targetId: batchItem.id,
			type: batchItem.type,
			size: batchItem.size,
		}
	}))

	const results = {}
	response.data.data.forEach((thumbnail) => {
		results[thumbnail.requestId] = thumbnail.state === "Completed" ? thumbnail.imageUrl : null
	})
	return results
})

export const getRobloxUser = RobloxUserResource.createInvoker({ mapId: parseInt, mapData: parseInt })
export const getRobloxUsername = RobloxUsernameResource.createInvoker()
export const getRobloxThumbnail = RobloxThumbnailResource.createInvoker({
	mapId: (type, id, size) => `${type}-${id}-${size}`,
	mapData: (type, id, size) => {
		return { type, id, size }
	},
})