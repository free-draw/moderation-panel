import { Snapshot, SnapshotLog, SnapshotLogType, SnapshotPlayerPartial } from "@free-draw/moderation-client"
import React from "react"
import styled from "styled-components"
import colors from "../../../assets/colors"

const logTextBuilders = {
	[SnapshotLogType.CHAT]: (player: SnapshotPlayerPartial, data: {
		content: string,
	}) => {
		return <> <em>{player.name}</em>: {data.content} </>
	},

	[SnapshotLogType.COMMAND]: (player: SnapshotPlayerPartial, data: string) => {
		return <i>{player.name} ran command "{data}"</i>
	},

	[SnapshotLogType.JOIN]: (player: SnapshotPlayerPartial) => {
		return <i>{player.name} joined</i>
	},

	[SnapshotLogType.LEAVE]: (player: SnapshotPlayerPartial) => {
		return <i>{player.name} left</i>
	},
}

export const LogElement = styled.span`
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

const LogComponent = ({ type, player, data }: SnapshotLog) => {
	const text = logTextBuilders[type](player, data)

	return (
		<LogElement>
			{text}
		</LogElement>
	)
}

export const LogsTabElement = styled.div`
	display: flex;
	flex-direction: column;
	padding: 20px;
`

const LogsTabComponent = ({ snapshot }: {
	snapshot: Snapshot,
}) => {
	return (
		<LogsTabElement>
			{
				snapshot.logs.map((log, index) => <LogComponent key={index} {...log} />)
			}
		</LogsTabElement>
	)
}

export default LogsTabComponent