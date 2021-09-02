import React from "react"
import styled from "styled-components"

const FieldElement = styled.div`
	display: flex;
	flex-direction: column;
	${props => props.inline ? "flex-grow: 1" : "width: 100%"};
`

const FieldNameElement = styled.span`
	font-size: 13px;
	font-weight: 400;
	margin-bottom: 7px;
`

const FieldValueElement = styled.span`
	font-size: 16px;
	font-weight: ${props => props.empty ? 400 : 600};
	font-style: ${props => props.empty ? "italic" : "normal"};
	opacity: ${props => props.empty ? "50%" : "100%"};
`

export function Field({ name, value, inline, empty }) {
	return (
		<FieldElement inline={inline}>
			<FieldNameElement>{name}</FieldNameElement>
			<FieldValueElement empty={empty}>
				{value}
			</FieldValueElement>
		</FieldElement>
	)
}

const FieldGroupElement = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 16px;
	position: relative;
`

export function FieldGroup(props) {
	return (
		<FieldGroupElement>
			{props.children}
		</FieldGroupElement>
	)
}

export {
	FieldElement,
	FieldNameElement,
	FieldValueElement,

	FieldGroupElement,
}