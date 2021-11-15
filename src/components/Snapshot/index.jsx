import React from "react"
import styled from "styled-components"
import { getSnapshot } from "@free-draw/moderation-client"
import API from "/src/API"
import Spinner from "/src/components/Spinner"
import {
	ViewerCanvas,
	ViewerHoverDetails,
	ViewerPlayerBubbles,
} from "/src/components/viewer"

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

function Snapshot({ snapshot, placeholder, report, ...props }) {
	return (
		<SnapshotElement state="LOADED" {...props}>
			<Tabs snapshot={snapshot} report={report} />
			<SnapshotCanvasElement data={snapshot.canvas}>
				<ViewerHoverDetails />
				<ViewerPlayerBubbles players={snapshot.players} />
			</SnapshotCanvasElement>
		</SnapshotElement>
	)
}

function SnapshotResolver({ snapshot, report, placeholder, ...props }) {
	const [ resolvedSnapshot, setResolvedSnapshot ] = React.useState(null)
	const [ state, setState ] = React.useState("NONE")

	React.useEffect(() => {
		if (snapshot) {
			setState("LOADING")
			snapshot.resolve(API).then((newResolvedSnapshot) => {
				return newResolvedSnapshot.fetchPlayerData(API).then(() => {
					setResolvedSnapshot(newResolvedSnapshot)
					setState("LOADED")
				})
			}, (error) => {
				setState("ERROR")
				throw error
			})
		} else {
			setState("NONE")
			setResolvedSnapshot(null)
		}
	}, [ snapshot ])

	switch (state) {
		case "LOADED":
			return <Snapshot snapshot={resolvedSnapshot} report={report} />

		case "LOADING":
			return (
				<SnapshotElement state="LOADING" {...props}>
					<Spinner />
				</SnapshotElement>
			)

		case "ERROR":
			return (
				<SnapshotElement state="ERROR" {...props}>
					<SnapshotStateTextElement>Error loading snapshot</SnapshotStateTextElement>
					<SnapshotStateSubtextElement>Check the console for more info</SnapshotStateSubtextElement>
				</SnapshotElement>
			)

		case "NONE":
			return (
				<SnapshotElement state="ERROR" {...props}>
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