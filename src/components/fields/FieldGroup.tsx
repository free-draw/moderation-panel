import React from "react"
import styled from "styled-components"

export const FieldGroupElement = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 16px;
	position: relative;
`

const FieldGroupComponent = (props: {
	children?: React.ReactNode,
}) => {
	return (
		<FieldGroupElement>
			{props.children}
		</FieldGroupElement>
	)
}

export default FieldGroupComponent