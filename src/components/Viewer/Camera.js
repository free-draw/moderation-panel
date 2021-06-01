import EventEmitter from "eventemitter2"

import Maid from "/src/class/Maid"
import Vector2 from "/src/class/Vector2"

const SCROLL_SCALE_RATE = 0.2

class Camera extends EventEmitter {
	constructor(input, screen) {
		super()

		this.input = input
		this.screen = screen

		this.reset()

		input.on("scroll", (delta, position) => {
			const center = new Vector2(screen.offsetWidth, screen.offsetHeight).divideScalar(2)
			const offset = position.subtract(center)

			const scale = delta * this.scale * SCROLL_SCALE_RATE

			this.processInputFrame({
				scale: scale,
				position: offset.divideScalar(this.scale).multiplyScalar(scale),
			})
		})

		input.on("down", (pointer) => {
			const maid = new Maid()

			maid.listen(pointer, "move", (_, delta) => {
				this.processInputFrame({
					position: delta.invert(),
				})
			})

			maid.listen(pointer, "up", () => {
				maid.clean()
			})
		})
	}

	getRelativePosition(screenPosition) {
		const center = new Vector2(this.screen.offsetWidth, this.screen.offsetHeight).divideScalar(2)
		return screenPosition.subtract(center).divideScalar(this.scale).add(this.position)
	}

	getState() {
		return {
			position: this.position,
			rotation: this.rotation,
			scale: this.scale,
		}
	}

	processInputFrame(inputFrame) {
		let { position, rotation, scale } = inputFrame

		if (scale) {
			this.scale = this.scale + scale
		}
		if (position) {
			position = position.divideScalar(this.scale)
			position = position.rotate(this.rotation)
			this.position = this.position.add(position)
		}
		if (rotation) {
			this.rotation = (this.rotation + rotation) % (Math.PI * 2)
		}

		this.emit("update", this.getState())
	}

	reset() {
		this.position = new Vector2(0, 0)
		this.rotation = 0
		this.scale = 30

		this.emit("update", this.getState())
	}
}

export default Camera