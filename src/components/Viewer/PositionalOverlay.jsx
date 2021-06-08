import React from "react"

import Maid from "/src/class/Maid"

class PositionalOverlay extends React.Component {
	constructor() {
		super()

		this.ref = React.createRef()
		this.maid = new Maid()
	}

	componentDidMount() {
		const ref = this.ref.current
		const camera = this.props.camera

		const updatePosition = () => {
			const position = camera.position.invert().add(this.props.position).multiplyScalar(camera.scale)
			const scale = this.props.ignoreScale ? 1 : camera.scale
			ref.style.transform = `translate(${position.x}px, ${position.y}px) scale(${scale})`
		}

		updatePosition()
		this.maid.listen(camera, "update", updatePosition)
	}

	componentWillUnmount() {
		this.maid.clean()
	}

	render() {
		return (
			<div className="positional-overlay" ref={this.ref}>
				{this.props.children}
			</div>
		)
	}
}

export default PositionalOverlay