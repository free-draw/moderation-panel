import React from "react"

import ViewerContext from "../ViewerContext"

import "./style.scss"

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
		<div className="viewer-positional-overlay" ref={ref}>
			{props.children}
		</div>
	)
}

export default ViewerPositionalOverlay