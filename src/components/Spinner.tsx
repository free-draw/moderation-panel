import React from "react"
import styled, { keyframes } from "styled-components"
import colors from "../assets/colors"
import SpinnerBackground from "../assets/spinner/background.svg"
import SpinnerForeground from "../assets/spinner/foreground.svg"

export const SpinnerAnimation = keyframes`
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
`

export const SpinnerElement = styled.div`
	position: relative;
	width: 24px;
	height: 24px;
`

export const SpinnerBackgroundElement = styled(SpinnerBackground)`
	position: absolute;
	top: 0;
	left: 0;
	color: #E0E0E0;
`

export const SpinnerForegroundElement = styled(SpinnerForeground)`
	animation: ${SpinnerAnimation} 550ms infinite linear;
	position: absolute;
	top: 0;
	left: 0;
	color: ${colors.brand[600]};
`

const SpinnerComponent = (props: Record<string, any>) => {
	return (
		<SpinnerElement {...props}>
			<SpinnerBackgroundElement />
			<SpinnerForegroundElement />
		</SpinnerElement>
	)
}

export default SpinnerComponent