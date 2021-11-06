import React from "react"
import styled from "styled-components"
import { getLogs } from "@free-draw/moderation-client"
import API from "/src/API"
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

	const [ content, setContent ] = React.useState([])
	const [ page, setPage ] = React.useState(null)

	const [ sort, setSort ] = React.useState("timeDescending")
	const [ filter, setFilter ] = React.useState(null)

	React.useEffect(async () => {
		setLoaded(false)

		const options = { ...sortMethods[sort], }
		if (filter) {
			options.type = filter
		}

		const initialPage = await getLogs(API, options)
		const initialPageResolved = await initialPage.resolveAll(API)

		setContent([ initialPageResolved ])
		setPage(initialPage)
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
					content.flatMap((pageResolved) => {
						return pageResolved.map((logResolved, index) => {
							return (
								<Log
									key={index}
									log={logResolved.log}
									data={logResolved.data}
									moderator={logResolved.moderator}
								/>
							)
						})
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

									const newPage = await page.next(API)
									const newPageResolved = await newPage.resolveAll()

									if (newPage.length > 0) {
										setPage(newPage)
										setContent([ ...content, newPageResolved ])
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