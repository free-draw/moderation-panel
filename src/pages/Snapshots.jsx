import React from "react"
import styled from "styled-components"
import { useRouteMatch } from "react-router"

import Page from "/src/components/Page"

import Snapshot from "/src/components/Snapshot"

const SnapshotsPageElement = styled(Page)``

const SnapshotElement = styled(Snapshot)`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`

function SnapshotsPage() {
	const { params } = useRouteMatch("/snapshots/:id")

	return (
		<SnapshotsPageElement>
			<SnapshotElement id={params.id} />
		</SnapshotsPageElement>
	)
}

export default SnapshotsPage

export {
	SnapshotsPageElement,
}