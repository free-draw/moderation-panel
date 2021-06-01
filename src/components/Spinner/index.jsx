import React from "react"

import SpinnerBackground from "./background.svg"
import SpinnerForeground from "./foreground.svg"

import "./style.scss"

export default function Spinner() {
	return (
		<div className="spinner">
			<SpinnerBackground className="spinner-background" />
			<SpinnerForeground className="spinner-foreground" />
		</div>
	)
}