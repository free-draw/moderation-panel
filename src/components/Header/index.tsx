import React from "react"
import styled from "styled-components"
import { getModerator, getToken, TokenType } from "@free-draw/moderation-client"
import API from "../../API"
import Logo from "../../assets/logo.svg"
import NavigationComponent from "./Navigation"

const HeaderElement = styled.div`
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

function HeaderComponent() {
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

export {
	HeaderElement,
	HeaderLogoElement,
	HeaderSpacerElement,
	HeaderContextElement,
	HeaderUserElement,
}