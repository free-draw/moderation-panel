import React from "react"
import styled from "styled-components"

const FieldElement = styled.div<{
	isInline?: boolean,
}>`
	display: flex;
	flex-direction: column;
	${props => props.isInline ? "flex-grow: 1" : "width: 100%"};
`

const FieldNameElement = styled.span`
	font-size: 13px;
	font-weight: 400;
	margin-bottom: 7px;
`

const FieldValueElement = styled.span<{
	isEmpty?: boolean,
}>`
	font-size: 16px;
	font-weight: ${props => props.isEmpty ? 400 : 600};
	font-style: ${props => props.isEmpty ? "italic" : "normal"};
	opacity: ${props => props.isEmpty ? "50%" : "100%"};
`

type FieldOptions = {
	name: string,
	value: string,
	isInline?: boolean,
	isEmpty?: boolean,
}

const FieldComponent = ({ name, value, isInline, isEmpty }: FieldOptions) => {
	return (
		<FieldElement isInline={isInline}>
			<FieldNameElement>{name}</FieldNameElement>
			<FieldValueElement isEmpty={isEmpty}>
				{value}
			</FieldValueElement>
		</FieldElement>
	)
}

export default FieldComponent