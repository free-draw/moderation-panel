import axios from "axios"

import Resource from "/src/class/Resource"

import useAsync from "/src/util/useAsync"

// Resources

const UserResource = new Resource(async (batch) => {
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

const ThumbnailResource = new Resource(async (batch) => {
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

// Batch invokers

function getUser(userId) {
	userId = parseInt(userId)
	return UserResource.invoke(userId, userId)
}

function getThumbnail(type, id, size) {
	const batchId = `${type}-${id}-${size}`
	return ThumbnailResource.invoke(batchId, { type, id, size })
}

export default {
	getUser,
	getThumbnail,

	useUser: useAsync(getUser),
	useThumbnail: useAsync(getThumbnail),
}