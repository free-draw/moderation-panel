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

export function getRobloxUser(userId) {
	userId = parseInt(userId)
	return RobloxUserResource.invoke(userId, userId)
}

export function getRobloxThumbnail(type, id, size) {
	const batchId = `${type}-${id}-${size}`
	return RobloxThumbnailResource.invoke(batchId, { type, id, size })
}