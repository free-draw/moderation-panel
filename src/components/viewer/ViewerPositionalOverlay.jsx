import React from "react"
import styled from "styled-components"

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

function ViewerPositionalOverlay(props) {
	const { camera } = React.useContext(ViewerContext)
	const ref = React.useRef()

	React.useEffect(() => {
		const updatePosition = () => {
			const position = camera.position.invert().add(props.position).multiplyScalar(camera.scale)
			const scale = props.ignoreScale ? 1 : camera.scale
			ref.current.style.transform = `translate(${position.x}px, ${position.y}px) scale(${scale})`
		}

		updatePosition()

		const listener = camera.on("update", updatePosition, { objectify: true })
		return () => listener.off()
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