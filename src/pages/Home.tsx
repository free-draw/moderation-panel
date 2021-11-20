import React from "react"
import styled from "styled-components"
import slart from "url:/src/assets/slart.png"

export const HomePageElement = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
`

export const SlartElement = styled.img.attrs({
	src: slart,
})`
	height: 40%;
`

export const SlartTextElement = styled.span`
	margin-top: 14px;
	font-size: 48px;
	font-weight: 400;
`

const HomePageComponent = () => {
	return (
		<HomePageElement>
			<SlartElement />
			<SlartTextElement>slart</SlartTextElement>
		</HomePageElement>
	)
}

export default HomePageComponent