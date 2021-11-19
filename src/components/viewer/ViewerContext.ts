import React from "react"
import Camera from "./ViewerCanvas/core/Camera"
import Canvas from "./ViewerCanvas/core/Canvas"
import Input from "./ViewerCanvas/core/Input"

type ViewerContextData = {
	canvas: Canvas,
	input: Input,
	camera: Camera,
}

const ViewerContext = React.createContext<ViewerContextData | null>(null)

export default ViewerContext