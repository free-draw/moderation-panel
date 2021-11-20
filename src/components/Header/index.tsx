import React from "react"
import styled from "styled-components"
import { getModerator, getToken, TokenType } from "@free-draw/moderation-client"
import API from "../../API"
import Logo from "../../assets/logo.svg"
import NavigationComponent from "./Navigation"

export const HeaderElement = styled.div`
	position: relative;
	width: 100%;
	min-height: 58px;
	max-height: 58px;
	padding: 0 26px;
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-bottom: 1px;
`

export const HeaderLogoElement = styled(Logo)`
	height: 34px;
	user-select: none;
`

export const HeaderSpacerElement = styled.div`
	flex-grow: 1;
`

export const HeaderContextElement = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`

export const HeaderUserElement = styled.span`
	font-size: 16px;
	font-weight: 400;

	em {
		font-style: normal;
		font-weight: 700;
	}
`

const HeaderComponent = () => {
	const [ loaded, setLoaded ] = React.useState(false)
	const [ name, setName ] = React.useState("")

	React.useEffect(() => {
		getToken(API).then(async (token) => {
			switch (token.type) {
				case TokenType.USER:
					const moderator = await getModerator(API, token.id!)
					setName(moderator!.name)
					break

				case TokenType.SERVER:
					setName("[SERVER]")
					break
			}

			setLoaded(true)
		})
	}, [])

	return (
		<HeaderElement>
			<HeaderLogoElement />
			<NavigationComponent />
			<HeaderSpacerElement />
			<HeaderContextElement>
				{
					loaded ? (
						<HeaderUserElement>
							Logged in as <em>{name}</em>
						</HeaderUserElement>
					) : null
				}
			</HeaderContextElement>
		</HeaderElement>
	)
}

export default HeaderComponent