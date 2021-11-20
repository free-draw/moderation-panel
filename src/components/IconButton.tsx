import React from "react"
import styled from "styled-components"
import Icon from "@mdi/react"

export const IconButtonElement = styled.div.attrs({
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

export type IconButtonOptions = {
	icon: string,
	color?: string,
	onClick: React.MouseEventHandler<HTMLDivElement>,
}

const IconButtonComponent = (props: IconButtonOptions) => {
	return (
		<IconButtonElement
			onClick={(event) => {
				event.stopPropagation()
				return props.onClick(event)
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

export default IconButtonComponent