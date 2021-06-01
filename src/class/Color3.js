class Color3 {
	constructor(r, g, b) {
		this.r = r
		this.g = g
		this.b = b
	}

	static fromDecimal(decimal) {
		return new Color3(
			(decimal >> 16) & 0b11111111,
			(decimal >> 8) & 0b11111111,
			decimal & 0b11111111
		)
	}

	toDecimal() {
		return (this.r << 16) + (this.g << 8) + this.b
	}
}

export default Color3