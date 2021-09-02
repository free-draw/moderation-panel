import React from "react"

import { getLogs } from "/src/api/logs"

import Page from "/src/components/Page"
import TextBox from "/src/components/TextBox"
import TextButton from "/src/components/TextButton"
import Dropdown from "/src/components/Dropdown"
import Spinner from "/src/components/Spinner"

import logTypes from "./logTypes"

import "./style.scss"

const sortMethods = {
	timeDescending: { direction: "DESCENDING" },
	timeAscending: { direction: "ASCENDING" },
}

function OptionsGroup(props) {
	return (
		<div className="options-group">
			<span className="options-label">{props.label}</span>
			<div className="options-container">
				{props.children}
			</div>
		</div>
	)
}

function LogsPage() {
	const [ loading, setLoading ] = React.useState(true)
	const [ pages, setPages ] = React.useState([])
	const [ sortMethod, setSortMethod ] = React.useState("timeDescending")
	const [ filterType, setFilterType ] = React.useState(null)

	React.useEffect(async () => {
		setLoading(true)

		const options = { ...sortMethods[sortMethod], }

		if (filterType) {
			options.type = filterType
		}

		setPages([
			await getLogs(options),
		])

		setLoading(false)
	}, [ sortMethod, filterType ])

	return (
		<Page name="logs">
			<div className="options-container">
				<div className="options">
					<OptionsGroup label="Sort">
						<Dropdown
							options={[
								{ id: "timeDescending", name: "Newest" },
								{ id: "timeAscending", name: "Oldest" },
							]}
							currentOption={sortMethod}
							onSelection={setSortMethod}
						/>
					</OptionsGroup>
					<OptionsGroup label="Filter">
						<Dropdown
							options={[
								{ id: null, name: "All" },

								{ id: "CREATE_ACTION", name: "Create Action" },
								{ id: "DISCARD_ACTION_BY_ID", name: "Discard Action (by ID)" },
								{ id: "DISCARD_ACTION_BY_TYPE", name: "Discard Action (by type)" },

								{ id: "CREATE_MODERATOR", name: "Create Moderator" },
								{ id: "DELETE_MODERATOR", name: "Delete Moderator" },
								{ id: "CREATE_MODERATOR_ACCOUNT", name: "Create Moderator Account" },
								{ id: "DELETE_MODERATOR_ACCOUNT", name: "Delete Moderator Account" },
								{ id: "UPDATE_MODERATOR", name: "Update Moderator" },

								{ id: "ACCEPT_REPORT", name: "Accept Report" },
								{ id: "DELETE_REPORT", name: "Delete Report" },
							]}
							currentOption={filterType}
							onSelection={setFilterType}
						/>
					</OptionsGroup>
				</div>
			</div>
			<div className="content">
				{
					[
						...pages.flatMap(page => page.logs).map((log, index) => {
							const LogComponent = logTypes[log.type]
							return <LogComponent key={index} log={log} />
						}),
						(
							<div key="view-more" className="view-more-container">
								{
									loading ? <Spinner /> : (
										<TextButton
											text="View More"
											style="filled"
											onClick={async () => {
												setLoading(true)

												const currentPage = pages[pages.length - 1]
												const newPage = await currentPage.next()

												if (newPage.logs.length > 0) {
													setPages([ ...pages, newPage ])
												}

												setLoading(false)
											}}
										/>
									)
								}
							</div>
						),
					]
				}
			</div>
		</Page>
	)
}

export default LogsPage