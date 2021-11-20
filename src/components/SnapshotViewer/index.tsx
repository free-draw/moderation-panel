import React from "react"
import styled from "styled-components"
import { Snapshot, getSnapshot, Report } from "@free-draw/moderation-client"
import API from "../../API"
import Spinner from "../Spinner"
import ViewerCanvasComponent from "../viewer/ViewerCanvas"
import ViewerHoverDetailsComponent from "../viewer/ViewerHoverDetails"
import ViewerPlayerBubblesComponent from "../viewer/ViewerPlayerBubbles"
import TabsComponent from "./Tabs"

export const SnapshotElement = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`

export const SnapshotStateTextElement = styled.span`
	font-size: 28px;
	font-weight: 700;
`

export const SnapshotStateSubtextElement = styled.span`
	font-size: 16px;
	font-weight: 300;
	margin-top: 8px;
`

export const SnapshotCanvasElement = styled(ViewerCanvasComponent)`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`

const SnapshotViewerComponent = ({ snapshot, report, ...props }: {
	snapshot: Snapshot,
	report?: Report,
	[key: string]: any,
}) => {
	return (
		<SnapshotElement {...props}>
			<TabsComponent snapshot={snapshot} report={report} />
			<SnapshotCanvasElement data={snapshot.canvas}>
				<ViewerHoverDetailsComponent />
				<ViewerPlayerBubblesComponent players={snapshot.players} />
			</SnapshotCanvasElement>
		</SnapshotElement>
	)
}

export enum SnapshotResolverState {
	LOADED = "LOADED",
	LOADING = "LOADING",
	ERROR = "ERROR",
	NONE = "NONE",
}

const SnapshotResolverComponent = ({ id, report, placeholder, ...props }: {
	id: string,
	report?: Report,
	placeholder: {
		text: string,
		subtext: string,
	},
	[key: string]: any,
}) => {
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
			return <SnapshotViewerComponent snapshot={snapshot!} report={report} />

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

export default SnapshotResolverComponent