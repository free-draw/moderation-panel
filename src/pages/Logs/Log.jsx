import React from "react"
import day from "dayjs"

import makeClassName from "/src/util/makeClassName"

import { Field, FieldGroup } from "/src/components/fields"
import TextButton from "/src/components/TextButton"

import Arrow from "/src/assets/arrow.svg"

function resolveText(text, data) {
	if (typeof text === "function") {
		return text(data)
	} else {
		return text
	}
}

function Log(props) {
	const { source, time } = props.log

	const [ open, setOpen ] = React.useState(false)

	const fields = [
		...props.fields,
		{
			name: "Time",
			value: time.toLocaleString(),
			inline: true,
		},
	]

	const text = resolveText(props.text, {
		sourceName: source.name,
		sourceElement: <em className="source">{source.name}</em>,
	})

	return (
		<div className={makeClassName("log", { open })} onClick={() => setOpen(!open)}>
			<div className="log-summary">
				<span className="log-text">{text}</span>
				<div className="log-spacer" />
				<span className="log-time">{day().to(day(time))}</span>
				<div className="log-arrow-container">
					<Arrow className="log-arrow" />
				</div>
			</div>
			{
				open ? (
					<div className="log-details">
						<FieldGroup>
							{
								fields.map(fieldData => <Field key={fieldData.name} {...fieldData} />)
							}
						</FieldGroup>
						<div className="log-buttons">
							{
								props.buttons.map(buttonData => <TextButton key={buttonData.id} {...buttonData} />)
							}
						</div>
					</div>
				) : null
			}
		</div>
	)
}

export default Log