import React from "react"
import styled from "styled-components"
import { getLogs, LogResolved, GetLogsOptions, LogsPage, SortDirection, LogType } from "@free-draw/moderation-client"
import API from "../../API"
import TextButtonComponent from "../../components/TextButton"
import SpinnerComponent from "../../components/Spinner"
import Options from "./Options"
import LogComponent from "./Log"
import ButtonStyle from "../../types/enum/ButtonStyle"
import SortMethod from "../../types/enum/SortMethod"
import { SortMethodOptions } from "../../types/enum/data/SortMethodData"

export const LogsPageElement = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	padding-top: 50px;
`

export const OptionsContainerElement = styled.div``

export const ContentContainerElement = styled.div`
	width: 750px;
	position: relative;
	display: flex;
	flex-direction: column;
`

export const ContentFooterElement = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	height: 100px;
`

const LogsPageComponent = () => {
	const [ loaded, setLoaded ] = React.useState(false)

	const [ content, setContent ] = React.useState<LogResolved[][]>([])
	const [ page, setPage ] = React.useState<LogsPage | null>(null)

	const [ sort, setSort ] = React.useState<SortMethod>(SortMethod.TIME_DESCENDING)
	const [ filter, setFilter ] = React.useState<LogType | null>(null)

	React.useEffect(() => {
		(async () => {
			setLoaded(false)

			const options = {
				...SortMethodOptions[sort],
				size: 30,
			} as Partial<GetLogsOptions>
			if (filter) {
				options.type = filter
			}

			const initialPage = await getLogs(API, options)
			const initialPageResolved = await initialPage.resolveAll(API)

			setContent([ initialPageResolved ])
			setPage(initialPage)
			setLoaded(true)
		})()
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
								<LogComponent
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
							<TextButtonComponent
								text="View More"
								style={ButtonStyle.FILLED}
								onClick={async () => {
									setLoaded(false)

									const newPage = await page!.next(API)
									if (newPage.logs.length > 0) {
										const newPageResolved = await newPage.resolveAll(API)

										setPage(newPage)
										setContent([ ...content, newPageResolved ])
									}

									setLoaded(true)
								}}
							/>
						) : <SpinnerComponent />
					}
				</ContentFooterElement>
			</ContentContainerElement>
		</LogsPageElement>
	)
}

export default LogsPageComponent