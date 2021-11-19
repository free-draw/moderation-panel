import React from "react"
import styled from "styled-components"
import { Snapshot, getSnapshot, Report } from "@free-draw/moderation-client"
import API from "../../API"
import Spinner from "../Spinner"
import {
	ViewerCanvas,
	ViewerHoverDetails,
	ViewerPlayerBubbles,
} from "../viewer"

import Tabs from "./Tabs"

const SnapshotElement = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`

const SnapshotStateTextElement = styled.span`
	font-size: 28px;
	font-weight: 700;
`

const SnapshotStateSubtextElement = styled.span`
	font-size: 16px;
	font-weight: 300;
	margin-top: 8px;
`

const SnapshotCanvasElement = styled(ViewerCanvas)`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`

function SnapshotViewer({ snapshot, report, ...props }: {
	snapshot: Snapshot,
	report?: Report,
	[key: string]: any,
}) {
	return (
		<SnapshotElement {...props}>
			<Tabs snapshot={snapshot} report={report} />
			<SnapshotCanvasElement data={snapshot.canvas}>
				<ViewerHoverDetails />
				<ViewerPlayerBubbles players={snapshot.players} />
			</SnapshotCanvasElement>
		</SnapshotElement>
	)
}

enum SnapshotResolverState {
	LOADED = "LOADED",
	LOADING = "LOADING",
	ERROR = "ERROR",
	NONE = "NONE",
}

function SnapshotResolver({ id, report, placeholder, ...props }: {
	id: string,
	report?: Report,
	placeholder: {
		text: string,
		subtext: string,
	},
	[key: string]: any,
}) {
	const [ snapshot, setSnapshot ] = React.useState<Snapshot | null>(null)
	const [ state, setState ] = React.useState<SnapshotResolverState>(SnapshotResolverState.NONE)

	React.useEffect(() => {
		if (id) {
			setState(SnapshotResolverState.LOADING)
			getSnapshot(API, id).then((newSnapshot) => {
				return newSnapshot!.fetchPlayerData(API).then(() => {
					setSnapshot(newSnapshot)
					setState(SnapshotResolverState.LOADED)
				})
			}, (error) => {
				setState(SnapshotResolverState.ERROR)
				throw error
			})
		} else {
			setState(SnapshotResolverState.NONE)
			setSnapshot(null)
		}
	}, [ id ])

	switch (state) {
		case SnapshotResolverState.LOADED:
			return <SnapshotViewer snapshot={snapshot!} report={report} />

		case SnapshotResolverState.LOADING:
			return (
				<SnapshotElement {...props}>
					<Spinner />
				</SnapshotElement>
			)

		case SnapshotResolverState.ERROR:
			return (
				<SnapshotElement {...props}>
					<SnapshotStateTextElement>Error loading snapshot</SnapshotStateTextElement>
					<SnapshotStateSubtextElement>Check the console for more info</SnapshotStateSubtextElement>
				</SnapshotElement>
			)

		case SnapshotResolverState.NONE:
			return (
				<SnapshotElement {...props}>
					<SnapshotStateTextElement>{placeholder.text}</SnapshotStateTextElement>
					<SnapshotStateSubtextElement>{placeholder.subtext}</SnapshotStateSubtextElement>
				</SnapshotElement>
			)
	}
}

export default SnapshotResolver

export {
	SnapshotElement,
	SnapshotStateTextElement,
	SnapshotStateSubtextElement,
	SnapshotCanvasElement,
}