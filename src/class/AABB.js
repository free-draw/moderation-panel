import Vector2 from "/src/class/Vector2"

class AABB {
	constructor() {
		this.minX = Infinity
		this.minY = Infinity
		this.maxX = -Infinity
		this.maxY = -Infinity
		this.points = 0
	}

	add(vector) {
		this.points += 1
		this.minX = Math.min(this.minX, vector.x)
		this.minY = Math.min(this.minY, vector.y)
		this.maxX = Math.max(this.maxX, vector.x)
		this.maxY = Math.max(this.maxY, vector.y)
	}

	get() {
		if (this.points > 0) {
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