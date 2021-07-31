import React from "react"

import makeClassName from "/src/util/makeClassName"

import "./style.scss"

const TextBox = React.forwardRef((props, ref) => {
	return <input {...props} className={makeClassName("text-box", [ props.className ])} type="text" ref={ref} />
})

export default TextBox