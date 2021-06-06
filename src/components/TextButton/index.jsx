import React from "react"

import "./style.scss"

function TextButton(props) {
	return (
		<span
			className={`text-button ${props.style ?? ""} ${props.variant ?? ""}`}
			role="button"
			onClick={props.onClick}
		>
			{props.text}
		</span>
	)
}

export default TextButton