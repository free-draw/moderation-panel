import React from "react"
import Icon from "@mdi/react"

import "./style.scss"

function IconButton(props) {
	return (
		<div
			className="icon-button"
			role="button"
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
		</div>
	)
}

export default IconButton