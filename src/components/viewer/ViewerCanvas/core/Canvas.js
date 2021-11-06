import EventEmitter from "eventemitter2"
import * as PIXI from "pixi.js"

import Maid from "/src/class/Maid"
import AABB from "/src/class/AABB"

import { clamp, getAngleDelta } from "/src/util/number"

function getCornerOffset(points, index) {
	const lastPoint = points[index - 1]
	const point = points[index]
	const nextPoint = points[index + 1]

	if (lastPoint && nextPoint) {
		let angleA = point.subtract(lastPoint).angle()
		let angleB = nextPoint.subtract(point).angle()

		let angleDelta = Math.abs(getAngleDelta(angleA, angleB))

		if (angleDelta < Math.PI / 2) {
			return Math.tan(angleDelta / 2)
		} else {
			return Math.tan((Math.PI - angleDelta) / 2)
		}
	} else {
		return 0
	}
}

class Line {
	constructor(layer, data) {
		this.layer = layer

		this.points = data.points
		this.options = data.options

		this.mesh = this.getMesh()
		this.collisionDetails = this.getCollisionDetails()
	}

	isTouching(point) {
		const distanceFromLineCenter = point.subtract(this.collisionDetails.center).magnitude
		if (distanceFromLineCenter > this.collisionDetails.radius) {
			return false
		}

		const thickness = this.options.thickness

		for (let index = 0; index < this.points.length; index++) {
			const A = this.points[index]
			const B = this.points[index + 1]

			if (A && B) {
				const delta = B.subtract(A)
				const center = A.add(delta.divideScalar(2))
				const length = delta.magnitude()

				const distanceFromPartCenter = point.subtract(center).magnitude()

				if (distanceFromPartCenter <= length + thickness / 2) {
					const relativePoint = point.subtract(A)

					const relativeProjectionDistance = delta.dot(relativePoint) / length
					const relativeProjectionPoint = delta.unit().multiplyScalar(clamp(relativeProjectionDistance, 0, length))
					const projectionPoint = A.add(relativeProjectionPoint)

					const distanceFromProjectionPoint = point.subtract(projectionPoint).magnitude()

					if (distanceFromProjectionPoint <= thickness / 2) {
						return true
					}
				}
			}
		}

		return false
	}

	getCollisionDetails() {
		const aabb = new AABB()
		this.points.forEach(point => aabb.add(point))

		const { min, max } = aabb.get()
		const delta = max.subtract(min)
		const center = min.add(delta.divideScalar(2))
		const radius = delta.magnitude() + this.options.thickness / 2

		return {
			aabb: { min, max },
			center,
			radius,
		}
	}

	getMesh() {
		const { color, thickness, transparency } = this.options

		const vertices = []
		const triangles = []

		for (let index = 0; index < this.points.length; index++) {
			let A = this.points[index]
			let B = this.points[index + 1]

			if (A && B) {
				let delta = B.subtract(A)
				let unit = delta.unit()

				let cornerOffsetA = unit.multiplyScalar(getCornerOffset(this.points, index) * thickness / 2)
				let cornerOffsetB = unit.multiplyScalar(getCornerOffset(this.points, index + 1) * thickness / 2)

				let sideOffset = unit.rotate(Math.PI / 2).multiplyScalar(thickness / 2)

				let vertexA0 = A.subtract(sideOffset).subtract(cornerOffsetA)
				let vertexA1 = A.add(sideOffset).subtract(cornerOffsetA)
				let vertexB0 = B.subtract(sideOffset).add(cornerOffsetB)
				let vertexB1 = B.add(sideOffset).add(cornerOffsetB)

				vertices.push(vertexA0.x)
				vertices.push(vertexA0.y)
				vertices.push(vertexA1.x)
				vertices.push(vertexA1.y)
				vertices.push(vertexB0.x)
				vertices.push(vertexB0.y)
				vertices.push(vertexB1.x)
				vertices.push(vertexB1.y)

				let startIndex = index * 4

				// Bottom-left
				triangles.push(startIndex)
				triangles.push(startIndex + 1)
				triangles.push(startIndex + 2)

				// Top right
				triangles.push(startIndex + 1)
				triangles.push(startIndex + 2)
				triangles.push(startIndex + 3)
			}
		}

		const geometry = new PIXI.Geometry()
		geometry.addAttribute("aVertexPosition", vertices, 2)
		geometry.addAttribute("aTextureCoord", [], 2)
		geometry.addIndex(triangles)

		const shader = new PIXI.MeshMaterial(PIXI.Texture.WHITE, {
			tint: color.toDecimal(),
		})

		const mesh = new PIXI.Mesh(geometry, shader, null, PIXI.DRAW_MODES.TRIANGLES)
		mesh.alpha = 1 - transparency

		return mesh
	}
}

class Layer extends EventEmitter {
	constructor(collector, data) {
		super()

		this.collector = collector

		this.name = data.name
		this.visible = data.visible
		this.lines = []

		this.container = new PIXI.Container()
		this.container.zIndex = data.index
		this.container.name = data.name

		data.lines.forEach((lineData) => {
			const line = new Line(this, lineData)
			this.addLine(line)
		})
	}

	addLine(line) {
		this.lines.push(line)
		this.container.addChild(line.mesh)
		this.emit("lineAdded", line)
	}

	removeLine(line) {
		this.lines = this.lines.filter(filterLine => filterLine !== line)
		this.container.removeChild(line.mesh)
		this.emit("lineRemoved", line)
	}

	// Casting

	getLineAt(point) {
		return this.lines.find(line => line.isTouching(point))
	}
}

class Collector extends EventEmitter {
	constructor(data) {
		super()

		this.owner = data.player
		this.layers = []

		this.container = new PIXI.Container()
		this.container.name = data.player.name

		data.layers.forEach((layerData) => {
			const layer = new Layer(this, layerData)
			this.addLayer(layer)
		})
	}

	addLayer(layer) {
		this.layers.push(layer)
		this.container.addChild(layer.container)
		this.emit("layerAdded", layer)
	}

	removeLayer(layer) {
		this.layers = this.layers.filter(filterLayer => filterLayer !== layer)
		this.container.removeChild(layer.container)
		this.emit("layerRemoved", layer)
	}
}

class Canvas extends EventEmitter {
	constructor(camera) {
		super()

		this.camera = camera
		this.collectors = []
		this.parent = null
		this.app = new PIXI.Application({
			antialias: true,
			autoDensity: true,
			resolution: window.devicePixelRatio ?? 1,
			backgroundAlpha: 0,
		})
		this.element = this.app.view
		this.maid = new Maid()

		const updateSize = () => {
			this.app.stage.position.set(
				this.app.renderer.width / 2,
				this.app.renderer.height / 2
			)
		}
		updateSize()
		this.maid.listen(this.app.renderer, "resize", updateSize)
	}

	addCollector(collector) {
		this.collectors.push(collector)
		this.app.stage.addChild(collector.container)
		this.emit("collectorAdded", collector)
	}

	removeCollector(collector) {
		this.collectors = this.collectors.filter(filterCollector => filterCollector !== collector)
		this.app.stage.removeChild(collector.container)
		this.emit("collectorRemoved", collector)
	}

	setCamera(camera) {
		const updateCamera = () => {
			const stage = this.app.stage
			const { position, rotation, scale } = camera.getState()
			stage.pivot.set(position.x, position.y)
			stage.rotation = rotation
			stage.scale.set(scale)
		}
		updateCamera()
		this.maid.listen(camera, "update", updateCamera)
		this.camera = camera
	}

	// Casting

	getSortedLayers() {
		let layers = []

		this.collectors.forEach((collector) => {
			layers = layers.concat(collector.layers)
		})

		layers = layers.sort((A, B) => A.index > B.index)

		return layers
	}

	getLineAt(point) {
		const sortedLayers = this.getSortedLayers()

		for (let index = 0; index < sortedLayers.length; index++) {
			const layer = sortedLayers[index]
			const line = layer.getLineAt(point)
			if (line) {
				return line
			}
		}

		return null
	}

	// Lifecycle methods

	clear() {
		this.collectors.forEach(collector => this.removeCollector(collector))
	}

	load(data) {
		this.clear()

		Object.values(data).forEach((canvas) => {
			canvas.parse() // TODO: Move this to where it can be caught

			const collector = new Collector(canvas.data)
			this.addCollector(collector)
		})
	}

	mount(parent) {
		if (this.parent) {
			this.parent.removeChild(this.app.view)
		}
		if (parent) {
			parent.appendChild(this.app.view)
		}

		this.app.resizeTo = parent ?? null
		this.parent = parent ?? null
	}

	destroy() {
		this.app.stop()
		this.mount(null)
	}
}

export default Canvas

export {
	Canvas,
	Collector,
	Layer,
	Line,
}