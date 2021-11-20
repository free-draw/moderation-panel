import React from "react"
import styled from "styled-components"
import { useRouteMatch } from "react-router"
import SnapshotViewerComponent from "../components/SnapshotViewer"

export const SnapshotsPageElement = styled.div``

export const SnapshotViewerElement = styled(SnapshotViewerComponent)`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`

const SnapshotsPageComponent = () => {
	const { params } = useRouteMatch<{
		snapshotId: string,
	}>("/snapshots/:snapshotId")!

	return (
		<SnapshotsPageElement>
			<SnapshotViewerElement
				id={params.snapshotId}
				placeholder={{
					text: "",
					subtext: "",
				}}
			/>
		</SnapshotsPageElement>
	)
}

export default SnapshotsPageComponent