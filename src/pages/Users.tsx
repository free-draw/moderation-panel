import React from "react"
import styled from "styled-components"
import { Link, useHistory } from "react-router-dom"
import Icon from "@mdi/react"
import { mdiSend } from "@mdi/js"
import { getRobloxUsername } from "@free-draw/moderation-client"
import API from "../API"
import colors from "../assets/colors"
import DialogComponent from "../components/Dialog"
import SpinnerComponent from "../components/Spinner"
import TextBoxComponent from "../components/TextBox"
import ButtonStyle from "../types/enum/ButtonStyle"

const PARTIAL_USERNAME_REGEX = /^[a-zA-Z0-9]?[a-zA-Z0-9_]?$/
const USERNAME_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9_]{1,18}[a-zA-Z0-9]$/

const UsersFailureDialogComponent = (props: {
	username: string,
	onClose: () => void,
}) => {
	return (
		<DialogComponent
			title="Couldn't find user"
			description={`Roblox user with username "${props.username}" couldn't be found. Please ensure it's typed correctly.`}
			buttons={[
				{
					id: "acknowledge",
					text: "Okay",
					style: ButtonStyle.FLAT,
					onClick: props.onClose,
				},
			]}
			onCancel={props.onClose}
		/>
	)
}

export const UsersPageElement = styled.div.attrs({
	fixed: true,
})`
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`

export const SearchFormContainerElement = styled.div`
	width: 450px;
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`

export const SearchFormElement = styled.form`
	position: relative;
	width: 100%;
	height: 48px;
	margin: 0;
`

export const SearchFormEntryElement = styled(TextBoxComponent)`
	width: 100%;
	height: 100%;
	padding: 0 14px;
`

export const SearchFormSubmitElement = styled(Icon).attrs({
	path: mdiSend,
	size: 1,
})<{
	onClick: () => void,
}>`
	position: absolute;
	right: 14px;
	top: calc(50% - (24px / 2));
	cursor: pointer;
	color: ${colors.brand[600]};
`

export const SearchFormSpinnerElement = styled(SpinnerComponent)`
	position: absolute;
	right: 14px;
	top: calc(50% - (24px / 2));
`

export const SearchFormHintElement = styled.span<{
	isError: boolean,
}>`
	margin-top: 14px;
	font-size: 14px;
	font-weight: 300;

	${props => props.isError ? "color: #d81b60" : ""};

	a {
		font-weight: 700;
		color: ${colors.brand[600]};
	}
`

const UsersPageComponent = () => {
	const history = useHistory()

	const [ content, setContent ] = React.useState<string>("")
	const [ failure, setFailure ] = React.useState<boolean>(false)
	const [ loading, setLoading ] = React.useState<boolean>(false)

	const isContentValid = PARTIAL_USERNAME_REGEX.test(content) || USERNAME_REGEX.test(content)

	const search = async () => {
		setLoading(true)
		const user = await getRobloxUsername(API, content)
		setLoading(false)

		if (user) {
			history.push(`/users/${user.id}`)
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

					{content.length > 0 && !loading ? <SearchFormSubmitElement onClick={search} /> : null}
					{loading ? <SearchFormSpinnerElement /> : null}
				</SearchFormElement>

				<SearchFormHintElement isError={!isContentValid}>
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
				failure ? <UsersFailureDialogComponent username={content} onClose={() => setFailure(false)} /> : null
			}
		</UsersPageElement>
	)
}

export default UsersPageComponent