import React from "react"
import styled from "styled-components"
import Page from "../components/Page"
import slart from "url:/src/assets/slart.png"

const HomePageElement = styled(Page)`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
`

const SlartElement = styled.img.attrs({
	src: slart,
})`
	height: 40%;
`

const SlartTextElement = styled.span`
	margin-top: 14px;
	font-size: 48px;
	font-weight: 400;
`

function HomePage() {
	return (
		<HomePageElement>
			<SlartElement />
			<SlartTextElement>slart</SlartTextElement>
		</HomePageElement>
	)
}

export default HomePage

export {
	HomePageElement,
}