import React from "react"
import styled from "styled-components"
import colors from "../assets/colors"
import Logo from "../assets/logo.svg"

export type LoginProvider = {
	id: string,
	name: string,
	textColor: string,
	backgroundColor: string,
}

const loginProviders = [
	{
		id: "discord",
		name: "Discord",
		textColor: "white",
		backgroundColor: "#5865f2",
	},
] as LoginProvider[]

export const LoginProviderElement = styled.a`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 220px;
	height: 42px;
	margin-top: 16px;
	border-radius: 8px;

	& + & {
		margin-top: 8px;
	}
`

export const LoginProviderTextElement = styled.span`
	font-size: 16px;
	font-weight: 400;

	em {
		font-style: normal;
		font-weight: 600;
	}
`

const LoginProviderComponent = ({ id, name, textColor, backgroundColor }: {
	id: string,
	name: string,
	textColor: string,
	backgroundColor: string,
}) => {
	return (
		<LoginProviderElement
			href={`/api/auth/redirect/${id}`}
			style={{
				color: textColor,
				background: backgroundColor,
			}}
		>
			<LoginProviderTextElement>
				Log in with <em>{name}</em>
			</LoginProviderTextElement>
		</LoginProviderElement>
	)
}

export const LoginPromptContainerElement = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
`

export const LoginPromptLogoElement = styled(Logo)`
	max-width: 200px;
	margin-bottom: 20px;
`

export const LoginPromptElement = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20px;
	border: 1px solid ${colors.border};
	border-radius: 12px;
	position: relative;
`

export const LoginPromptHeaderElement = styled.div`
	font-size: 14px;
	font-weight: 400;
	color: #7F7F7F;
`

export const LoginProvidersElement = styled.div`
	display: flex;
	flex-direction: column;
`

const LoginPromptComponent = () => {
	return (
		<LoginPromptContainerElement>
			<LoginPromptLogoElement />
			<LoginPromptElement>
				<LoginPromptHeaderElement>You aren't logged in.</LoginPromptHeaderElement>
				<LoginProvidersElement>
					{
						loginProviders.map((loginProviderData) => {
							return <LoginProviderComponent key={loginProviderData.id} {...loginProviderData} />
						})
					}
				</LoginProvidersElement>
			</LoginPromptElement>
		</LoginPromptContainerElement>
	)
}

export default LoginPromptComponent