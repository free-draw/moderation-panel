import React from "react"
import { Link, useHistory } from "react-router-dom"
import Icon from "@mdi/react"
import { mdiSend } from "@mdi/js"

import makeClassName from "/src/util/makeClassName"

import { getRobloxUsername } from "/src/api/roblox"

import Page from "/src/components/Page"
import Dialog from "/src/components/Dialog"
import Spinner from "/src/components/Spinner"
import TextBox from "/src/components/TextBox"

import "./style.scss"

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
		<Page name="users" fixed>
			<div className="search-container">
				<form
					className="search-bar-form"
					onSubmit={(event) => {
						search()
						event.preventDefault()
					}}
				>
					<TextBox
						className={makeClassName("search-bar", { error: !isContentValid })}
						type="text"
						placeholder="Username"
						onChange={event => setContent(event.target.value)}
					/>

					<Icon
						className={makeClassName("search-submit", { active: content.length > 0 && !loading })}
						path={mdiSend}
						size={1}
						onClick={search}
					/>

					{
						loading ? <Spinner /> : null
					}
				</form>

				<span className={makeClassName("search-hint", { error: !isContentValid })}>
					{
						isContentValid ? (
							<>
								Looking for recent bans? <Link to="/logs">Check the logs tab.</Link>
							</>
						) : "Invalid username"
					}
				</span>
			</div>

			{
				failure ? <UsersFailureDialog username={content} close={() => setFailure(false)} /> : null
			}
		</Page>
	)
}

export default UsersPage