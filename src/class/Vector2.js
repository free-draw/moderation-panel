class Vector2 {
	constructor(x, y) {
		this.x = x
		this.y = y
	}

	add(other) {
		const x = this.x + other.x
		const y = this.y + other.y
		return new Vector2(x, y)
	}

	subtract(other) {
		const x = this.x - other.x
		const y = this.y - other.y
		return new Vector2(x, y)
	}

	multiply(other) {
		const x = this.x * other.x
		const y = this.y * other.y
		return new Vector2(x, y)
	}

	multiplyScalar(value) {
		return new Vector2(this.x * value, this.y * value)
	}

	divide(other) {
		const x = this.x / other.x
		const y = this.y / other.y
		return new Vector2(x, y)
	}

	divideScalar(value) {
		return new Vector2(this.x / value, this.y / value)
	}

	dot(other) {
		return this.x*other.x + this.y*other.y
	}

	invert() {
		return new Vector2(-this.x, -this.y)
	}

	angle() {
		return Math.atan2(this.x, this.y)
	}

	rotate(theta) {
		const sin = Math.sin(theta)
		const cos = Math.cos(theta)

		const x = this.x * cos + this.y * sin
		const y = -this.x * sin + this.y * cos

		return new Vector2(x, y)
	}

	lerp(other, alpha) {
		const x = this.x + (other.x - this.x) * alpha
		const y = this.y + (other.y - this.y) * alpha
		return new Vector2(x, y)
	}

	magnitude() {
		const x = this.x
		const y = this.y
		return Math.sqrt(x*x + y*y)
	}

	unit() {
		const magnitude = this.magnitude()
		const x = this.x / magnitude
		const y = this.y / magnitude
		return new Vector2(x, y)
	}
}

export default Vector2