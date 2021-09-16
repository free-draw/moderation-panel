import EventEmitter from "eventemitter2"
import axios from "axios"
import { io } from "socket.io-client"
import lodash from "lodash"

class Report extends EventEmitter {
	constructor(data) {
		super()

		this.id = data.id
		this.result = data.result
		this.reason = data.reason
		this.notes = data.notes
		this.from = data.fromUserId
		this.target = data.targetUserId
		this.snapshot = data.snapshot

		this._data = data
	}

	async accept(type, reason, duration) {
		await axios.post(`/api/reports/${this.id}/accept`, { type, reason, duration })
		this.result = "ACCEPTED"
		this.emit("accept")
	}

	async decline() {
		await axios.post(`/api/reports/${this.id}/decline`)
		this.result = "DECLINED"
		this.emit("decline")
	}
}

class ReportList extends EventEmitter {
	constructor() {
		super()

		this.active = false
		this.reports = []
	}

	getReportById(reportId) {
		return this.reports.find(report => report.id === reportId)
	}

	// Rest API

	async refresh() {
		const response = await axios.get("/api/reports")

		const newReports = response.data.reports
			.filter(reportData => !this.getReportById(reportData.id))
			.map(reportData => new Report(reportData))
		newReports.forEach(report => this.emit("add", report))

		this.reports = [ ...this.reports, newReports ]
		this.emit("update", this.reports)

		return this.reports
	}

	connect() {
		if (!this.active) {
			this.refresh()

			this.socket = io("/reports")

			this.socket.on("reportCreate", (reportData) => {
				if (!this.getReportById(reportData.id)) {
					const report = new Report(reportData)

					report.on(["accept", "decline"], () => {
						this.reports = lodash.without(this.reports, report)
					})

					this.reports = [ ...this.reports, report ]
					this.emit("add", report)
					this.emit("update", this.reports)
				}
			})

			this.socket.on("reportDelete", (reportData) => {
				const report = this.getReportById(reportData.id)
				if (report) {
					if (reportData.result === "ACCEPTED") {
						report.result = "ACCEPTED"
						report.emit("accept")
					} else if (reportData.result === "DECLINED") {
						report.result = "DECLINED"
						report.emit("decline")
					}

					this.reports = lodash.without(this.reports, report)
					this.emit("remove", report)
					this.emit("update", this.reports)
				}
			})

			this.active = true
		}
	}

	disconnect() {
		if (this.active) {
			this.socket.disconnect()
			this.socket = null
			this.active = false
		}
	}
}

export async function getReport(reportId) {
	const response = await axios(`/api/reports/${reportId}`)
	return new Report(response.data.report)
}

export const reportList = new ReportList()