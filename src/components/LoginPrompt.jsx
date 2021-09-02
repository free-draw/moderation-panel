import React from "react"
import styled from "styled-components"

import colors from "/src/presets/colors"

import Logo from "/src/assets/logo.svg"

const loginProviders = [
	{
		id: "discord",
		name: "Discord",
		colors: {
			text: "white",
			background: "#5865f2",
		},
	},
]

const LoginProviderElement = styled.a`
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

const LoginProviderTextElement = styled.span`
	font-size: 16px;
	font-weight: 400;

	em {
		font-style: normal;
		font-weight: 600;
	}
`

function LoginProvider({ id, name, colors }) {
	return (
		<LoginProviderElement
			href={`/api/auth/redirect/${id}`}
			style={{
				background: colors.background,
				color: colors.text,
			}}
		>
			<LoginProviderTextElement>
				Log in with <em>{name}</em>
			</LoginProviderTextElement>
		</LoginProviderElement>
	)
}

const LoginPromptContainerElement = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
`

const LogoElement = styled(Logo)`
	max-width: 200px;
	margin-bottom: 20px;
`

const LoginPromptElement = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20px;
	border: 1px solid ${colors.border};
	border-radius: 12px;
	position: relative;
`

const LoginPromptHeaderElement = styled.div`
	font-size: 14px;
	font-weight: 400;
	color: #7F7F7F;
`

const LoginProvidersElement = styled.div`
	display: flex;
	flex-direction: column;
`

function LoginPrompt() {
	return (
		<LoginPromptContainerElement>
			<LogoElement />
			<LoginPromptElement>
				<LoginPromptHeaderElement>You aren't logged in.</LoginPromptHeaderElement>
				<LoginProvidersElement>
					{
						loginProviders.map((loginProviderData) => {
							return <LoginProvider key={loginProviderData.id} {...loginProviderData} />
						})
					}
				</LoginProvidersElement>
			</LoginPromptElement>
		</LoginPromptContainerElement>
	)
}

export default LoginPrompt