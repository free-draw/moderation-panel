import { Vector2 } from "@free-draw/moderation-client"

export type AABBResult = {
	min: Vector2,
	max: Vector2,
}

class AABB {
	public minX: number
	public minY: number
	public maxX: number
	public maxY: number
	public pointCount: number

	constructor() {
		this.minX = Infinity
		this.minY = Infinity
		this.maxX = -Infinity
		this.maxY = -Infinity
		this.pointCount = 0
	}

	add(point: Vector2): void {
		this.pointCount += 1
		this.minX = Math.min(this.minX, point.x)
		this.minY = Math.min(this.minY, point.y)
		this.maxX = Math.max(this.maxX, point.x)
		this.maxY = Math.max(this.maxY, point.y)
	}

	get(): AABBResult {
		if (this.pointCount > 0) {
			return {
				min: new Vector2(this.minX, this.minY),
				max: new Vector2(this.maxX, this.maxY),
			}
		} else {
			return {
				min: new Vector2(0, 0),
				max: new Vector2(0, 0),
			}
		}
	}
}

export default AABB