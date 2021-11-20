import React from "react"
import styled from "styled-components"

const PageElement = styled.div``

function PageComponent({ name, children, ...props }: {
	name: string,
	children: React.ReactNode[],
	[key: string]: any,
}) {
	return (
		<PageElement {...props}>
			{children}
		</PageElement>
	)
}

export default PageComponent

export {
	PageElement,
}