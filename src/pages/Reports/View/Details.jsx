import React from "react"
import Icon from "@mdi/react"
import { mdiAccountDetails, mdiMessageText, mdiHumanHandsdown } from "@mdi/js"

import useAsync from "/src/util/useAsync"

import { getRobloxUser, getRobloxThumbnail } from "/src/api/roblox"

const tabs = [
	{
		id: "reportInfo",
		name: "Report Info",
		icon: mdiAccountDetails,
		render(props) {
			const report = props.report
			
			const targetUser = useAsync(getRobloxUser)(report.target)
			const targetAvatar = useAsync(getRobloxThumbnail)("AvatarHeadShot", report.target, "150x150")

			return (
				<>
					<div className="report-details-section">
						<span className="report-details-section-name">Reason</span>
						<span className="report-reason">{report.reason}</span>
						<span className={`report-notes ${report.notes ? "" : "empty"}`}>{report.notes ?? "No additional notes"}</span>
					</div>

					<div className="report-details-section">
						<span className="report-details-section-name">Reported Player</span>
						<a href={`https://www.roblox.com/users/${24346602}/profile`} target="_blank">
							{
								targetUser ? (
									<div className="report-target">
										<img className="report-target-avatar" src={targetAvatar ?? ""} />
										<div className="report-target-text">
											<span className="report-target-name">{targetUser.name}</span>
											<span className="report-target-click-prompt">Click to view profile</span>
										</div>
									</div>
								) : (
									<div className="report-target">
										<div className="report-target-avatar loading" />
									</div>
								)
							}
						</a>
					</div>
				</>
			)
		},
	},
	{
		id: "chatLogs",
		name: "Chat Logs",
		icon: mdiMessageText,
		render(props) {
			const report = props.report

			return (
				<>
					
				</>
			)
		},
	},
	{
		id: "playerList",
		name: "Player List",
		icon: mdiHumanHandsdown,
		render(props) {
			const report = props.report

			return (
				<>

				</>
			)
		},
	},
]

function DetailsButton(props) {
	return (
		<div className={`report-details-tab-button ${props.active ? "active" : ""}`} onClick={props.onClick} title={props.name}>
			<Icon
				path={props.icon}
				size={1}
				color={props.active ? "white" : "black"}
			/>
		</div>
	)
}

function Details(props) {
	const [ currentTab, setCurrentTab ] = React.useState(tabs[0].id)
	const currentTabData = tabs.find(tabData => tabData.id === currentTab)

	const tabButtons = tabs.map((tabData) => {
		return (
			<DetailsButton
				key={tabData.id}
				name={props.name}
				icon={tabData.icon}
				active={currentTabData.id === tabData.id}
				onClick={() => setCurrentTab(tabData.id)}
			/>
		)
	})

	return (
		<div className="report-details">
			<div className="report-details-tabs">
				{ tabButtons }
			</div>
			<div className="report-details-contents">
				<currentTabData.render report={props.report} />
			</div>
		</div>
	)
}

export default Details