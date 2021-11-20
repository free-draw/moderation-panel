import React from "react"
import styled from "styled-components"
import { Field, FieldGroup } from "../../components/fields"
import TextButton from "../../components/TextButton"
import colors from "../../presets/colors"
import Arrow from "../../assets/arrow.svg"
import logTypes, { LogButtonOptions, LogFieldOptions } from "./logTypes"
import { Log, LogTypeData, Moderator } from "@free-draw/moderation-client"
import day from "dayjs"
import "dayjs/plugin/relativeTime"

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

function LogExtendedDetails({ fields, buttons }: {
	fields: LogFieldOptions[],
	buttons: LogButtonOptions[],
}) {
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

const LogArrowElement = styled(Arrow)<{
	isOpen: boolean,
}>`
	color: #828282;
	max-height: 12px;

	${props => props.isOpen ? "transform: rotate(90deg)" : ""};
`

function LogsLog({ log, moderator, data }: {
	log: Log,
	moderator: Moderator,
	data: LogTypeData[keyof LogTypeData],
}) {
	const logType = logTypes[log.type]
	const { color, text, fields, buttons } = logType(
		data,
		<LogTextSourceElement>{moderator.name}</LogTextSourceElement>
	)

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
					<LogArrowElement isOpen={open} />
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

export default LogsLog