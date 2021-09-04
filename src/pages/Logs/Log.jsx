import React from "react"
import styled from "styled-components"
import day from "dayjs"

import { Field, FieldGroup } from "/src/components/fields"
import TextButton from "/src/components/TextButton"

import colors from "/src/presets/colors"

import Arrow from "/src/assets/arrow.svg"

import * as logTypes from "./logTypes"

const LogExtendedDetailsElement = styled.div`
	padding: 4px 20px 16px;
	display: flex;
	flex-direction: column;
`

const LogExtendedDetailsFieldsElement = styled(FieldGroup)``

const LogExtendedDetailsButtonsElement = styled.div`
	margin-top: 20px;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
`

function LogExtendedDetails({ fields, buttons }) {
	fields = fields.filter(fieldData => fieldData !== null)
	buttons = buttons.filter(buttonData => buttonData !== null)

	return (
		<LogExtendedDetailsElement>
			{
				fields.length > 0 ? (
					<LogExtendedDetailsFieldsElement>
						{fields.map(fieldData => <Field key={fieldData.name} {...fieldData} />)}
					</LogExtendedDetailsFieldsElement>
				) : null
			}
			{
				buttons.length > 0 ? (
					<LogExtendedDetailsButtonsElement>
						{buttons.map(buttonData => <TextButton key={buttonData.id} {...buttonData} />)}
					</LogExtendedDetailsButtonsElement>
				) : null
			}

		</LogExtendedDetailsElement>
	)
}

const LogElement = styled.div`
	border: 1px solid ${colors.border};
	border-radius: 8px;
	position: relative;
	overflow: hidden;

	& + & {
		margin-top: 10px;
	}
`

const LogColorElement = styled.div`
	width: 3px;
	height: 100%;
	position: absolute;
`

const LogDetailsElement = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 48px;
	cursor: pointer;
	user-select: none;
	padding: 0 20px;
`

const LogTextElement = styled.span`
	font-size: 17px;

	em {
		font-weight: 600;
		font-style: normal;
	}
`

const LogTextSourceElement = styled.span`
	color: ${colors.brand[600]};
	font-weight: 600;
`

const LogSpacerElement = styled.div`
	flex-grow: 1;
`

const LogTimeElement = styled.span`
	color: #828282;
	font-size: 15px;
	margin-right: 18px;
	transform: translate(0, -1px);
`

const LogArrowContainerElement = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	max-width: 12px;
	max-height: 12px;
`

const LogArrowElement = styled(Arrow)`
	color: #828282;
	max-height: 12px;

	${props => props.open ? "transform: rotate(90deg)" : ""};
`

function Log({ log }) {
	const logType = logTypes[log.type]

	const { color, text, fields, buttons } = logType({
		log,
		source: <LogTextSourceElement>{log.source.name}</LogTextSourceElement>,
	})

	const [ open, setOpen ] = React.useState(false)

	return (
		<LogElement>
			<LogColorElement
				style={{
					background: color,
				}}
			/>
			<LogDetailsElement onClick={() => setOpen(!open)}>
				<LogTextElement>{text}</LogTextElement>
				<LogSpacerElement />
				<LogTimeElement>
					{day().to(day(log.time))}
				</LogTimeElement>
				<LogArrowContainerElement>
					<LogArrowElement open={open} />
				</LogArrowContainerElement>
			</LogDetailsElement>
			{
				open ? (
					<LogExtendedDetails
						fields={[
							...fields,
							{
								name: "Time",
								value: log.time.toLocaleString(),
								inline: true,
							},
						]}
						buttons={buttons}
					/>
				) : null
			}
		</LogElement>
	)
}

export default Log