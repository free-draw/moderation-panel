import ReportStatus from "../enum/ReportStatus"
import SnapshotResolvable from "./resolvable/SnapshotResolvable"
import UserResolvable from "./resolvable/UserResolvable"

type ReportData = {
	id: string,
	status: ReportStatus,
	target: number,
	from: number,
	reason: string,
	notes: string,
	snapshot?: string,
}

class Report {
	public id: string
	public status: ReportStatus
	public target: UserResolvable
	public from: UserResolvable
	public reason: string
	public notes: string
	public snapshot?: SnapshotResolvable

	constructor(data: ReportData) {
		this.id = data.id
		this.status = data.status
		this.target = new UserResolvable(data.target)
		this.from = new UserResolvable(data.from)
		this.reason = data.reason
		this.notes = data.notes
		this.snapshot = data.snapshot ? new SnapshotResolvable(data.snapshot) : undefined
	}

	public async accept(): Promise<void> {
		// TODO
	}

	public async decline(): Promise<void> {
		// TODO
	}
}

export default Report
export { Report, ReportData }