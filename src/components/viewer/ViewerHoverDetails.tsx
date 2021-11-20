import { Vector2 } from "@free-draw/moderation-client"
import React from "react"
import styled from "styled-components"
import { Pointer } from "./ViewerCanvas/core/Input"
import ViewerContext from "./ViewerContext"

export const ViewerHoverDetailsElement = styled.div<{
	isEnabled: boolean,
}>`
	position: absolute;
	top: 0;
	left: 0;
	pointer-events: none;
	user-select: none;
	visibility: ${props => props.isEnabled ? "visible" : "hidden"};

	background: rgba(0, 0, 0, 50%);
	padding: 8px 12px;
	border-radius: 8px;
`

export const ViewerHoverDetailsNameElement = styled.span`
	color: white;
	font-size: 16px;
`

const ViewerHoverDetailsComponent = () => {
	const ref = React.useRef() as React.RefObject<HTMLDivElement>

	const context = React.useContext(ViewerContext)
	if (!context) throw new Error("ViewerHoverDetails must be inside of a ViewerCanvas")
	const { canvas, input } = context

	const [ enabled, setEnabled ] = React.useState<boolean>(false)
	const [ name, setName ] = React.useState<string | null>(null)

	React.useEffect(() => {
		const onMove = (_pointer: Pointer, screenPosition: Vector2) => {
			const position = canvas.camera!.getRelativePosition(screenPosition)
			const line = canvas.getLineAt(position)

			const shouldBeEnabled = !!line
			if (enabled !== shouldBeEnabled) {
				setEnabled(shouldBeEnabled)
			}

			if (line) {
				const collector = line.layer.collector
				const owner = collector.owner

				if (name !== owner.name) {
					setName(owner.name!)
				}
			}

			ref.current!.style.transform = `translate(${screenPosition.x}px, ${screenPosition.y}px)`
		}

		input.on("move", onMove)
		return () => {
			input.off("move", onMove)
		}
	}, [ enabled, name ])

	return (
		<ViewerHoverDetailsElement isEnabled={enabled} ref={ref}>
			<ViewerHoverDetailsNameElement>{name}</ViewerHoverDetailsNameElement>
		</ViewerHoverDetailsElement>
	)
}

export default ViewerHoverDetailsComponent