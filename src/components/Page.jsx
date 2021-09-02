import React from "react"

function Page(props) {
	return (
		<div className={`page page-${props.name}`}>
			{props.children}
		</div>
	)
}

export default Page