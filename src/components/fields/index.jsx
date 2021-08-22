import React from "react"

import makeClassName from "/src/util/makeClassName"

import "./style.scss"

export function Field(props) {
	return (
		<div className={makeClassName("field", { inline: props.inline })}>
			<span className="field-name">{props.name}</span>
			<span className={makeClassName("field-value", { empty: props.empty })}>
				{props.value}
			</span>
		</div>
	)
}

export function FieldGroup(props) {
	return (
		<div className="field-group">
			{props.children}
		</div>
	)
}