import { Parser } from "binary-parser"

import Vector2 from "../class/Vector2"
import Color3 from "../class/Color3"

const Line = new Parser()
	.endianess("little")
	.uint8("type")
	.bit24("color")
	.uint8("thickness")
	.uint8("transparency")
	.uint16("pointCount")
	.doublele("initialX").doublele("initialY")
	.array("offsets", {
		type: new Parser().floatle("x").floatle("y"),
		length: function() {
			return this.pointCount - 1
		},
	})

const Layer = new Parser()
	.endianess("little")
	.uint8("nameLength").string("name", {
		length: "nameLength",
	})
	.uint8("visible")
	.uint64("lineCount").array("lines", {
		type: Line,
		length: "lineCount",
	})

const File = new Parser()
	.endianess("little")
	.string("header", {
		length: 8,
	})
	.uint8("version")
	.uint8("layerCount").array("layers", {
		type: Layer,
		length: "layerCount",
	})

export function parse(buffer) {
	const data = parseRaw(buffer)

	const layers = data.layers.map((layerData, index) => {
		return {
			index,
			name: layerData.name,
			visible: layerData.visible === 1 ? true : false,
			lines: layerData.lines.map((lineData) => {
				const points = []

				let currentPoint = new Vector2(lineData.initialX, lineData.initialY)
				points.push(currentPoint)

				for (let index = 0; index < lineData.offsets.length; index++) {
					const offset = lineData.offsets[index]
					currentPoint = currentPoint.add(new Vector2(offset.x, offset.y))
					points.push(currentPoint)
				}

				return {
					points: points,
					options: {
						color: Color3.fromDecimal(lineData.color),
						thickness: lineData.thickness / 100,
						transparency: lineData.transparency / 100,
					},
				}
			}),
		}
	})

	return {
		layers: layers,
	}
}

export function parseRaw(buffer) {
	return File.parse(buffer)
}