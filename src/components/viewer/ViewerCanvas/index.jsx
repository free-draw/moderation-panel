import React from "react"
import styled from "styled-components"

import Canvas from "./core/Canvas"
import Camera from "./core/Camera"
import Input from "./core/Input"

import ViewerContext from "../ViewerContext"

const ViewerCanvasElement = styled.div`
	position: relative;
	overflow: hidden;
`

class ViewerCanvas extends React.Component {
	constructor(props) {
		super()

		this.ref = React.createRef()

		this.canvas = new Canvas()
		this.input = new Input(this.canvas.element)
		this.camera = new Camera(this.input, this.canvas.element)

		this.canvas.setCamera(this.camera)

		if (props.data) {
			this.canvas.load(props.data)
		}
	}

	componentDidMount() {
		this.canvas.mount(this.ref.current)
	}

	componentDidUpdate(lastProps) {
		if (this.props.data !== lastProps.data) {
			this.camera.reset()
			this.canvas.clear()

			if (this.props.data) {
				this.canvas.load(this.props.data)
			}
		}
	}

	componentWillUnmount() {
		this.canvas.destroy()
	}

	render() {
		const context = {
			canvas: this.canvas,
			input: this.input,
			camera: this.camera,
		}

		return (
			<ViewerContext.Provider value={context}>
				<ViewerCanvasElement ref={this.ref} className={this.props.className}>
					{this.props.children}
				</ViewerCanvasElement>
			</ViewerContext.Provider>
		)
	}
}

export default ViewerCanvas

export {
	ViewerCanvasElement,
}