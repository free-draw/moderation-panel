import React from "react"
import styled from "styled-components"

import { getLogs } from "/src/api/logs"

import Page from "/src/components/Page"
import TextButton from "/src/components/TextButton"
import Spinner from "/src/components/Spinner"

import Options from "./Options"
import Log from "./Log"

const sortMethods = {
	timeDescending: { direction: "DESCENDING" },
	timeAscending: { direction: "ASCENDING" },
}

const LogsPageElement = styled(Page)`
	display: flex;
	flex-direction: row;
	justify-content: center;
	padding-top: 50px;
`

const OptionsContainerElement = styled.div``

const ContentContainerElement = styled.div`
	width: 750px;
	position: relative;
	display: flex;
	flex-direction: column;
`

const ContentFooterElement = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	height: 100px;
`

function LogsPage() {
	const [ loaded, setLoaded ] = React.useState(false)
	const [ pages, setPages ] = React.useState([])

	const [ sort, setSort ] = React.useState("timeDescending")
	const [ filter, setFilter ] = React.useState(null)

	React.useEffect(async () => {
		setLoaded(false)

		const options = { ...sortMethods[sort], }
		if (filter) {
			options.type = filter
		}
		setPages([ await getLogs(options) ])

		setLoaded(true)
	}, [ sort, filter ])

	return (
		<LogsPageElement>
			<OptionsContainerElement>
				<Options
					sort={sort}
					setSort={setSort}
					filter={filter}
					setFilter={setFilter}
				/>
			</OptionsContainerElement>
			<ContentContainerElement>
				{
					pages.flatMap((page) => {
						return page.logs.map((logData, index) => <Log key={index} log={logData} />)
					})
				}
				<ContentFooterElement>
					{
						loaded ? (
							<TextButton
								text="View More"
								style="filled"
								onClick={async () => {
									setLoaded(false)

									const page = await pages[pages.length - 1].next()
									if (page.logs.length > 0) {
										setPages([ ...pages, page ])
									}

									setLoaded(true)
								}}
							/>
						) : <Spinner />
					}
				</ContentFooterElement>
			</ContentContainerElement>
		</LogsPageElement>
	)
}

export default LogsPage

export {
	LogsPageElement,
}