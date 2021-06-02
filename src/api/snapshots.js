import axios from "axios"

export async function getSnapshot(snapshotId) {
	const response = await axios.get(`/api/snapshots/${snapshotId}`)
	return response.data
}