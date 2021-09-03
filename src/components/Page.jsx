import React from "react"
import styled from "styled-components"

const PageElement = styled.div``

function Page({ name, className, children, ...props }) {
	return (
		// TODO: Remove compatibility once refactored
		<PageElement className={`page-${name} ${className}`} {...props}>
			{children}
		</PageElement>
	)
}

export default Page

export {
	PageElement,
}