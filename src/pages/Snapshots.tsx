import React from "react"
import styled from "styled-components"
import { useRouteMatch } from "react-router"
import PageComponent from "../components/Page"
import SnapshotViewerComponent from "../components/SnapshotViewer"

const SnapshotsPageElement = styled(PageComponent)``

const SnapshotViewerElement = styled(SnapshotViewerComponent)`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`

function SnapshotsPageComponent() {
	const { params } = useRouteMatch<{
		id: string,
	}>("/snapshots/:id")!

	return (
		<SnapshotsPageElement>
			<SnapshotViewerElement
				id={params.id}
				placeholder={{
					text: "",
					subtext: "",
				}}
			/>
		</SnapshotsPageElement>
	)
}

export default SnapshotsPageComponent

export {
	SnapshotsPageElement,
}