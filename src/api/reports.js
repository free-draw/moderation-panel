import EventEmitter from "eventemitter2"
import axios from "axios"
import { io } from "socket.io-client"
import lodash from "lodash"

class Report extends EventEmitter {
	constructor(data) {
		super()

		this.id = data.id
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
		this.current = []
	}

	getReportById(reportId) {
		return this.current.find(report => report.id === reportId)
	}

	// Rest API

	async refresh() {
		const response = await axios.get("/api/reports")

		response.data.reports.forEach((reportData) => {
			if (!this.getReportById(reportData.id)) {
				const report = new Report(reportData)
				this.current.push(report) // TTODO: Make this immutable
				this.emit("add", report)
			}
		})

		this.emit("update", this.current)
	}

	connect() {
		if (!this.active) {
			this.refresh()

			this.socket = io("/reports")

			this.socket.on("reportCreate", (reportData) => {
				if (!this.getReportById(reportData.id)) {
					const report = new Report(reportData)

					report.on(["accept", "decline"], () => {
						this.current = lodash.without(this.current, report)
					})

					this.current.push(report)
					this.emit("add", report)
					this.emit("update", this.current)
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

					this.current = lodash.without(this.current, report)
					this.emit("remove", report)
					this.emit("update", this.current)
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