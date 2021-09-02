import React from "react"

import makeClassName from "/src/util/makeClassName"

import "./style.scss"

function TextButton(props) {
	// TODO: Add disabled state

	return (
		<span
			className={makeClassName("text-button", [ props.style, props.variant ])}
			role="button"
			onClick={(event) => {
				event.stopPropagation()
				props.onClick(event)
			}}
		>
			{props.text}
		</span>
	)
}

export default TextButton