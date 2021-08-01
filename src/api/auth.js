import axios from "axios"

import { getModerator } from "/src/api/moderators"

export async function getCurrentUser() {
	const response = await axios.get("/api/auth/me")
	const { type, id } = response.data

	switch (type) {
		case "USER":
			return { type, moderator: await getModerator(id) }
		case "SERVER":
			return { type }
	}
}