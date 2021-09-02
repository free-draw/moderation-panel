import React from "react"
import styled from "styled-components"
import Icon from "@mdi/react"

const IconButtonElement = styled.div.attrs({
	role: "button",
})`
	display: inline-block;
	padding: 9px;
	border-radius: 50%;
	cursor: pointer;
	z-index: 5;

	&:hover {
		background: rgba(0, 0, 0, 10%);
	}
`

function IconButton(props) {
	return (
		<IconButtonElement
			onClick={(event) => {
				event.stopPropagation()
				props.onClick()
			}}
		>
			<Icon
				path={props.icon}
				size={1}
				color={props.color}
			/>
		</IconButtonElement>
	)
}

export default IconButton