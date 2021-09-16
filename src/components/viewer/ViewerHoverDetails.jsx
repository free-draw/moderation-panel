import React from "react"
import styled from "styled-components"

import ViewerContext from "./ViewerContext"

const ViewerHoverDetailsElement = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	pointer-events: none;
	user-select: none;
	visibility: ${props => props.enabled ? "visible" : "hidden"};

	background: rgba(0, 0, 0, 50%);
	padding: 8px 12px;
	border-radius: 8px;
`

const ViewerHoverDetailsNameElement = styled.span`
	color: white;
	font-size: 16px;
`

function ViewerHoverDetails() {
	const [ enabled, setEnabled ] = React.useState(false)
	const [ name, setName ] = React.useState(null)

	const ref = React.useRef()
	const { canvas, input } = React.useContext(ViewerContext)

	React.useEffect(() => {
		const listener = input.on("move", (_, screenPosition) => {
			const position = canvas.camera.getRelativePosition(screenPosition)
			const line = canvas.getLineAt(position)

			const shouldBeEnabled = !!line
			if (enabled !== shouldBeEnabled) {
				setEnabled(shouldBeEnabled)
			}

			if (line) {
				const collector = line.layer.collector
				const owner = collector.owner

				if (name !== owner.name) {
					setName(owner.name)
				}
			}

			ref.current.style.transform = `translate(${screenPosition.x}px, ${screenPosition.y}px)`
		}, { objectify: true })

		return () => listener.off()
	}, [ enabled, name ])

	return (
		<ViewerHoverDetailsElement enabled={enabled} ref={ref}>
			<ViewerHoverDetailsNameElement>{name}</ViewerHoverDetailsNameElement>
		</ViewerHoverDetailsElement>
	)
}

export default ViewerHoverDetails

export {
	ViewerHoverDetailsElement,
	ViewerHoverDetailsNameElement,
}