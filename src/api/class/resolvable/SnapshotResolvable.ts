import API from "../../API"
import Resolvable from "./Resolvable"
import Snapshot from "../Snapshot"
import getSnapshot from "../../method/snapshot/getSnapshot"

class SnapshotResolvable implements Resolvable<Snapshot> {
	public id: string

	constructor(id: string) {
		this.id = id
	}

	public async resolve(api: API): Promise<Snapshot | null> {
		return getSnapshot(api, this.id)
	}
}

export default SnapshotResolvable