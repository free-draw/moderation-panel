import React from "react"

import makeClassName from "/src/util/makeClassName"

import "./style.scss"

function TextButton(props) {
	return (
		<span
			className={makeClassName("text-button", [ props.style, props.variant ])}
			role="button"
			onClick={props.onClick}
		>
			{props.text}
		</span>
	)
}

export default TextButton