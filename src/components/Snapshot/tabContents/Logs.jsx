import React from "react"
import styled from "styled-components"

import colors from "/src/presets/colors"

const logTextCreators = {
	CHAT(player, data) {
		return <> <em>{player.name}</em>: {data.content} </>
	},

	COMMAND(player, data) {
		return <i>{player.name} ran command "{data}"</i>
	},

	JOIN(player) {
		return <i>{player.name} joined</i>
	},

	LEAVE(player) {
		return <i>{player.name} left</i>
	},
}

const LogElement = styled.span`
	font-size: 15px;
	font-weight: 300;

	em {
		color: ${colors.brand[600]};
		font-weight: 700;
		font-style: inherit;
	}

	& + & {
		margin-top: 4px;
	}
`

function Log({ type, player, data }) {
	const text = logTextCreators[type](player, data)

	return (
		<LogElement>
			{text}
		</LogElement>
	)
}

const LogsTabElement = styled.div`
	display: flex;
	flex-direction: column;
	padding: 20px;
`

function LogsTab({ snapshot }) {
	return (
		<LogsTabElement>
			{
				snapshot.logs.map((logData, index) => <Log key={index} {...logData} />)
			}
		</LogsTabElement>
	)
}

export default LogsTab

export {
	LogElement,
	LogsTabElement,
}