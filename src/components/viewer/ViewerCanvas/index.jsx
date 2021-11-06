import React from "react"
import styled from "styled-components"
import Canvas from "./core/Canvas"
import Camera from "./core/Camera"
import Input from "./core/Input"
import useStaticValue from "/src/util/useStaticValue"
import ViewerContext from "../ViewerContext"

const ViewerCanvasElement = styled.div`
	position: relative;
	overflow: hidden;
`

function ViewerCanvas({ data, className, children }) {
	const ref = React.useRef()

	const canvas = useStaticValue(() => new Canvas())
	const input = useStaticValue(() => new Input(canvas.element))
	const camera = useStaticValue(() => new Camera(input, canvas.element))

	React.useEffect(() => {
		canvas.setCamera(camera)
		canvas.mount(ref.current)
		if (data) {
			canvas.load(data)
		}

		return () => {
			canvas.destroy()
		}
	}, [])

	React.useEffect(() => {
		camera.reset()
		canvas.clear()

		if (data) {
			canvas.load(data)
		}
	}, [ data ])

	const context = React.useMemo(() => {
		return {
			canvas,
			camera,
			input,
		}
	}, [ canvas, camera, input ])

	return (
		<ViewerContext.Provider value={context}>
			<ViewerCanvasElement ref={ref} className={className}>
				{children}
			</ViewerCanvasElement>
		</ViewerContext.Provider>
	)
}

export default ViewerCanvas

export {
	ViewerCanvasElement,
}