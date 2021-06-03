import React from "react"

import Maid from "../../class/Maid"
import Vector2 from "../../class/Vector2"

class HoverDetails extends React.Component {
	constructor() {
		super()

		this.state = {
			name: null,
			active: false,
		}

		this.maid = new Maid()
		this.ref = React.createRef()
	}

	componentDidMount() {
		const { canvas, input } = this.props

		this.maid.listen(input, "move", (_, screenPosition) => {
			const position = canvas.camera.getRelativePosition(screenPosition)
			const line = canvas.getLineAt(position)

			const active = !!line
			if (this.state.active !== active) {
				this.setState({
					active,
				})
			}

			if (line) {
				const collector = line.layer.collector
				const owner = collector.owner

				this.setState({
					name: owner.name,
				})
			}

			this.ref.current.style.transform = `translate(${screenPosition.x}px, ${screenPosition.y}px)`
		})
	}

	componentWillUnmount() {
		this.maid.clean()
	}

	render() {
		return (
			<div className={`hover-details ${this.state.active ? "active" : ""}`} ref={this.ref}>
				<span className="username">{this.state.name}</span>
			</div>
		)
	}
}

export default HoverDetails