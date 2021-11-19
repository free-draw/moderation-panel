import React from "react"
import styled from "styled-components"
import { Vector2 } from "@free-draw/moderation-client"
import ViewerContext from "./ViewerContext"

const ViewerPositionalOverlayElement = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform-origin: top left;
	z-index: 5;
	pointer-events: none;

	> * {
		pointer-events: all;
	}
`

function ViewerPositionalOverlay(props: {
	position: Vector2,
	ignoreScale?: boolean,
}) {
	const context = React.useContext(ViewerContext)
	if (!context) throw new Error("ViewerPositionalOverlay must be inside of a ViewerCanvas")
	const { camera } = context

	const ref = React.useRef() as React.RefObject<HTMLDivElement>

	React.useEffect(() => {
		const onUpdate = () => {
			const position = camera.position.inverse().add(props.position).multiplyScalar(camera.scale)
			const scale = props.ignoreScale ? 1 : camera.scale
			ref.current!.style.transform = `translate(${position.x}px, ${position.y}px) scale(${scale})`
		}

		onUpdate()
		camera.on("update", onUpdate)
		return () => {
			camera.off("update", onUpdate)
		}
	}, [ props.position, props.ignoreScale ])

	return (
		<ViewerPositionalOverlayElement ref={ref}>
			{props.children}
		</ViewerPositionalOverlayElement>
	)
}

export default ViewerPositionalOverlay

export {
	ViewerPositionalOverlayElement,
}