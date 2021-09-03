import React from "react"
import styled from "styled-components"

const PageElement = styled.div``

function Page({ name, children }) {
	return (
		// TODO: Remove compatibility once refactored
		<PageElement className={`page-${name}`}>
			{children}
		</PageElement>
	)
}

export default Page

export {
	PageElement,
}