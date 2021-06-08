import React from "react"

import "./style.scss"

const TextBox = React.forwardRef((props, ref) => {
	return (
		<input
			className="text-box"
			type="text"
			id={props.id}
			placeholder={props.placeholder}
			ref={ref}
		/>
	)
})

export default TextBox