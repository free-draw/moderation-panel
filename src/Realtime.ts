import { Realtime } from "@free-draw/moderation-client"
import Cookies from "js-cookie"

const token = Cookies.get("token")
if (!token) throw new Error("No token found")

const realtime = new Realtime(window.location.host, token)
realtime.connect()

export default realtime