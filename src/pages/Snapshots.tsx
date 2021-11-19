import React from "react"
import styled from "styled-components"
import { useRouteMatch } from "react-router"
import Page from "../components/Page"
import SnapshotViewer from "../components/SnapshotViewer"

const SnapshotsPageElement = styled(Page)``

const SnapshotViewerElement = styled(SnapshotViewer)`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`

function SnapshotsPage() {
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

export default SnapshotsPage

export {
	SnapshotsPageElement,
}