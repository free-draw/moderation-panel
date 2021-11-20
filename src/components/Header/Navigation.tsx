import React from "react"
import styled from "styled-components"
import { Link, useRouteMatch } from "react-router-dom"
import colors from "../../assets/colors"

export const NavigationButtonElement = styled(Link)<{
	isSelected: boolean,
}>`
	position: relative;
	padding: 8px 16px;
	border-radius: 8px;
	box-sizing: border-box;
	color: ${props => props.isSelected ? "white" : "black"};

	${
		props => props.isSelected
			? `background: ${colors.brand[600]}`
			: `border: 1px solid ${colors.border}`
	};

	&:hover {
		background: ${props => props.isSelected ? colors.brand[700] : "rgba(0, 0, 0, 10%)"}
	}

	& + & {
		margin-left: 10px;
	}
`

export const NavigationButtonTextElement = styled.span`
	font-size: 17px;
	font-weight: 300;
`

const NavigationButtonComponent = ({ text, path, exact }: {
	text: string,
	path: string,
	exact?: boolean,
}) => {
	const match = useRouteMatch({ path, exact })

	return (
		<NavigationButtonElement isSelected={!!match} to={path}>
			<NavigationButtonTextElement>{text}</NavigationButtonTextElement>
		</NavigationButtonElement>
	)
}

export const NavigationElement = styled.div`
	height: 100%;
	margin: 0 32px;
	display: flex;
	flex-direction: row;
	align-items: center;
	user-select: none;
`

const NavigationComponent = () => {
	return (
		<NavigationElement>
			<NavigationButtonComponent text="Home" path="/" exact />
			<NavigationButtonComponent text="Reports" path="/reports" />
			<NavigationButtonComponent text="Users" path="/users" />
			<NavigationButtonComponent text="Logs" path="/logs" />
		</NavigationElement>
	)
}

export default NavigationComponent