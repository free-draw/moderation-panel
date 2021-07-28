import React from "react"

import makeClassName from "/src/util/makeClassName"

import Header from "/src/components/Header"

import "./style.scss"

function Page(props) {
	return (
		<div className={makeClassName(`page page-${props.name}`, { fixed: props.fixed })}>
			<Header />
			<div className="page-container">
				{props.children}
			</div>
		</div>
	)
}

export default Page