import React from "react"
import styled, { keyframes } from "styled-components"

import colors from "/src/presets/colors"

import SpinnerBackground from "/src/assets/spinner/background.svg"
import SpinnerForeground from "/src/assets/spinner/foreground.svg"

const SpinnerAnimation = keyframes`
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
`

const SpinnerElement = styled.div`
	position: relative;
	width: 24px;
	height: 24px;
`

const SpinnerBackgroundElement = styled(SpinnerBackground)`
	position: absolute;
	top: 0;
	left: 0;
	color: #E0E0E0;
`

const SpinnerForegroundElement = styled(SpinnerForeground)`
	animation: ${SpinnerAnimation} 550ms infinite linear;
	position: absolute;
	top: 0;
	left: 0;
	color: ${colors.brand[600]};
`

export default function Spinner() {
	return (
		<SpinnerElement>
			<SpinnerBackgroundElement />
			<SpinnerForegroundElement />
		</SpinnerElement>
	)
}