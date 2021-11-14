import { Realtime } from "@free-draw/moderation-client"
import Cookies from "js-cookie"

const token = Cookies.get("token")
const realtime = new Realtime(window.location.host, token!)

if (token) {
	realtime.connect()
}

export default realtime