import React from "react"

import makeClassName from "/src/util/makeClassName"

import ViewerContext from "../ViewerContext"

import "./style.scss"

function ViewerHoverDetails() {
	const [ active, setActive ] = React.useState(false)
	const [ name, setName ] = React.useState(null)

	const ref = React.useRef()
	const { canvas, input } = React.useContext(ViewerContext)

	React.useEffect(() => {
		const listener = input.on("move", (_, screenPosition) => {
			const position = canvas.camera.getRelativePosition(screenPosition)
			const line = canvas.getLineAt(position)

			const shouldBeActive = !!line
			if (active !== shouldBeActive) {
				setActive(shouldBeActive)
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
	}, [ active, name ])

	return (
		<div className={makeClassName("hover-details", { active })} ref={ref}>
			<span className="username">{name}</span>
		</div>
	)
}

export default ViewerHoverDetails