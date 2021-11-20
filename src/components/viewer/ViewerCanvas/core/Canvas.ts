import { EventEmitter2 } from "eventemitter2"
import * as PIXI from "pixi.js"

import Maid from "../../../../util/Maid"
import AABB, { AABBResult } from "../../../../util/AABB"

import { clamp, getAngleDelta } from "../../../../util/number"
import { Vector2, SnapshotPlayer, ParsedLine, ParsedLayer, ParsedFile, Snapshot } from "@free-draw/moderation-client"
import Camera from "./Camera"

function getCornerOffset(points: Vector2[], index: number) {
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

export type CollisionDetails = {
	aabb: AABBResult,
	center: Vector2,
	radius: number,
}

export class Line {
	public layer: Layer

	public points: Vector2[]
	public options: any

	public mesh: PIXI.Mesh
	public collisionDetails: CollisionDetails

	constructor(layer: Layer, data: ParsedLine) {
		this.layer = layer

		this.points = data.points
		this.options = data.options

		this.mesh = this.getMesh()
		this.collisionDetails = this.getCollisionDetails()
	}

	public isTouching(point: Vector2): boolean {
		const distanceFromLineCenter = point.subtract(this.collisionDetails.center).magnitude()
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

	public getCollisionDetails(): CollisionDetails {
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

	public getMesh(): PIXI.Mesh {
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

		const mesh = new PIXI.Mesh(geometry, shader, undefined, PIXI.DRAW_MODES.TRIANGLES)
		mesh.alpha = 1 - transparency

		return mesh
	}
}

export class Layer extends EventEmitter2 {
	public collector: Collector

	public index: number
	public name: string
	public visible: boolean
	public lines: Line[]

	public container: PIXI.Container = new PIXI.Container()

	constructor(collector: Collector, data: ParsedLayer) {
		super()

		this.collector = collector

		this.index = data.index
		this.name = data.name
		this.visible = data.visible
		this.lines = []

		this.container.zIndex = data.index
		this.container.name = data.name

		data.lines.forEach((lineData) => {
			const line = new Line(this, lineData)
			this.addLine(line)
		})
	}

	public addLine(line: Line): void {
		this.lines.push(line)
		this.container.addChild(line.mesh)
		this.emit("lineAdded", line)
	}

	public removeLine(line: Line): void {
		this.lines = this.lines.filter(filterLine => filterLine !== line)
		this.container.removeChild(line.mesh)
		this.emit("lineRemoved", line)
	}

	// Casting

	public getLineAt(point: Vector2): Line | undefined {
		return this.lines.find(line => line.isTouching(point))
	}
}

export class Collector extends EventEmitter2 {
	public owner: SnapshotPlayer
	public layers: Layer[]

	public container: PIXI.Container = new PIXI.Container()

	constructor(player: SnapshotPlayer, data: ParsedFile) {
		super()

		this.owner = player
		this.layers = []
		this.container.name = player.name as string

		data.layers.forEach((layerData) => {
			const layer = new Layer(this, layerData)
			this.addLayer(layer)
		})
	}

	public addLayer(layer: Layer): void {
		this.layers.push(layer)
		this.container.addChild(layer.container)
		this.emit("layerAdded", layer)
	}

	public removeLayer(layer: Layer): void {
		this.layers = this.layers.filter(filterLayer => filterLayer !== layer)
		this.container.removeChild(layer.container)
		this.emit("layerRemoved", layer)
	}
}

class Canvas extends EventEmitter2 {
	public camera?: Camera
	public collectors: Collector[] = []

	public readonly app: PIXI.Application = new PIXI.Application({
		antialias: true,
		autoDensity: true,
		resolution: window.devicePixelRatio ?? 1,
		backgroundAlpha: 0,
	})

	public parent?: HTMLElement | null = null
	public element: HTMLElement

	private maid: Maid = new Maid()

	constructor() {
		super()

		this.element = this.app.view

		const updateSize = () => {
			this.app.stage.position.set(
				this.app.renderer.width / 2,
				this.app.renderer.height / 2
			)
		}
		updateSize()
		this.maid.listen(this.app.renderer, "resize", updateSize)
	}

	public addCollector(collector: Collector): void {
		this.collectors.push(collector)
		this.app.stage.addChild(collector.container)
		this.emit("collectorAdded", collector)
	}

	public removeCollector(collector: Collector): void {
		this.collectors = this.collectors.filter(filterCollector => filterCollector !== collector)
		this.app.stage.removeChild(collector.container)
		this.emit("collectorRemoved", collector)
	}

	public setCamera(camera: Camera): void {
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

	public getSortedLayers(): Layer[] {
		let layers = [] as Layer[]

		this.collectors.forEach((collector) => {
			layers = layers.concat(collector.layers)
		})

		layers = layers.sort((A, B) => {
			if (A.index > B.index) {
				return 1
			} else if (A.index < B.index) {
				return -1
			} else {
				return 0
			}
		})

		return layers
	}

	public getLineAt(point: Vector2): Line | null {
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

	public clear(): void {
		this.collectors.forEach(collector => this.removeCollector(collector))
	}

	public load(data: Snapshot["canvas"]): void {
		this.clear()

		Object.values(data).forEach((canvas) => {
			canvas.parse() // TODO: Move this to where it can be caught
			const collector = new Collector(canvas.player, canvas.data as ParsedFile)
			this.addCollector(collector)
		})
	}

	public mount(parent: HTMLElement | null): void {
		if (this.parent) {
			this.parent.removeChild(this.app.view)
		}
		if (parent) {
			this.app.resizeTo = parent
			parent.appendChild(this.app.view)
		}

		this.parent = parent ?? null
	}

	public destroy(): void {
		this.app.stop()
		this.mount(null)
	}
}

export default Canvas