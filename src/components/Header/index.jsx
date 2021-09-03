import React from "react"
import styled from "styled-components"

import { getCurrentUser } from "/src/api/auth"

import Logo from "/src/assets/logo.svg"

import Settings from "./Settings"
import Navigation from "./Navigation"

const HeaderElement = styled.div`
	position: relative;
	width: 100%;
	height: 58px;
	padding: 0 26px;
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-bottom: 1px;
`

const HeaderLogoElement = styled(Logo)`
	height: 34px;
	user-select: none;
`

const HeaderSpacerElement = styled.div`
	flex-grow: 1;
`

const HeaderContextElement = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`

const HeaderUserElement = styled.span`
	font-size: 16px;
	font-weight: 400;
	margin-right: 18px;

	em {
		font-style: normal;
		font-weight: 700;
	}
`

function Header() {
	const [ loaded, setLoaded ] = React.useState(false)
	const [ username, setUsername ] = React.useState("")

	React.useEffect(async () => {
		const { type, moderator } = await getCurrentUser()
		setUsername(type === "SERVER" ? "[SERVER]" : moderator.name)
		setLoaded(true)
	}, [])

	return (
		<HeaderElement>
			<HeaderLogoElement />
			<Navigation />
			<HeaderSpacerElement />
			<HeaderContextElement>
				{
					loaded ? (
						<HeaderUserElement>
							Logged in as <em>{username}</em>
						</HeaderUserElement>
					) : null
				}
				<Settings />
			</HeaderContextElement>
		</HeaderElement>
	)
}

export default Header

export {
	HeaderElement,
	HeaderLogoElement,
	HeaderSpacerElement,
	HeaderContextElement,
	HeaderUserElement,
}