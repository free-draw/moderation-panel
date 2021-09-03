import React from "react"
import styled from "styled-components"
import { Link, useHistory } from "react-router-dom"
import Icon from "@mdi/react"
import { mdiSend } from "@mdi/js"

import { getRobloxUsername } from "/src/api/roblox"

import colors from "/src/presets/colors"

import Page from "/src/components/Page"
import Dialog from "/src/components/Dialog"
import Spinner from "/src/components/Spinner"
import TextBox from "/src/components/TextBox"

const PARTIAL_USERNAME_REGEX = /^[a-zA-Z0-9]?[a-zA-Z0-9_]?$/
const USERNAME_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9_]{1,18}[a-zA-Z0-9]$/

function UsersFailureDialog(props) {
	return (
		<Dialog
			title="Couldn't find user"
			description={`Roblox user with username "${props.username}" couldn't be found. Please ensure it's typed correctly.`}
			buttons={[
				{
					id: "acknowledge",
					text: "Okay",
					style: "flat",
					onClick: props.close,
				},
			]}
			onCancel={props.close}
		/>
	)
}

const UsersPageElement = styled(Page).attrs({
	fixed: true,
})`
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`

const SearchFormContainerElement = styled.div`
	width: 450px;
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`

const SearchFormElement = styled.form`
	position: relative;
	width: 100%;
	height: 48px;
	margin: 0;
`

const SearchFormEntryElement = styled(TextBox)`
	width: 100%;
	height: 100%;
	padding: 0 14px;
`

const SearchFormSubmitElement = styled(Icon).attrs({
	path: mdiSend,
	size: 1,
})`
	visibility: ${props => props.active ? "visible" : "hidden"};
	position: absolute;
	right: 14px;
	top: calc(50% - (24px / 2));
	cursor: pointer;
	color: ${colors.brand[600]};
`

const SearchFormSpinnerElement = styled(Spinner)`
	position: absolute;
	right: 14px;
	top: calc(50% - (24px / 2));
`

const SearchFormHintElement = styled.span`
	margin-top: 14px;
	font-size: 14px;
	font-weight: 300;

	${props => props.error ? "color: #d81b60" : ""};

	a {
		font-weight: 700;
		color: ${colors.brand[600]};
	}
`

function UsersPage() {
	const history = useHistory()

	const [ content, setContent ] = React.useState("")
	const [ failure, setFailure ] = React.useState(false)
	const [ loading, setLoading ] = React.useState(false)

	const isContentValid = PARTIAL_USERNAME_REGEX.test(content) || USERNAME_REGEX.test(content)

	const search = async () => {
		setLoading(true)
		const userId = await getRobloxUsername(content)
		setLoading(false)

		if (userId) {
			history.push(`/users/${userId}`)
		} else {
			setFailure(true)
		}
	}

	return (
		<UsersPageElement>
			<SearchFormContainerElement>
				<SearchFormElement
					onSubmit={(event) => {
						search()
						event.preventDefault()
					}}
				>
					<SearchFormEntryElement
						type="text"
						placeholder="Username"
						onChange={event => setContent(event.target.value)}
					/>

					<SearchFormSubmitElement
						active={content.length > 0 && !loading}
						onClick={search}
					/>

					{
						loading ? <SearchFormSpinnerElement /> : null
					}
				</SearchFormElement>

				<SearchFormHintElement error={!isContentValid}>
					{
						isContentValid ? (
							<>
								Looking for recent bans? <Link to="/logs">Check the logs tab.</Link>
							</>
						) : "Invalid username"
					}
				</SearchFormHintElement>
			</SearchFormContainerElement>

			{
				failure ? <UsersFailureDialog username={content} close={() => setFailure(false)} /> : null
			}
		</UsersPageElement>
	)
}

export default UsersPage

export {
	UsersPageElement,

	SearchFormContainerElement,
	SearchFormElement,
	SearchFormEntryElement,
	SearchFormSubmitElement,
	SearchFormSpinnerElement,
	SearchFormHintElement,
}