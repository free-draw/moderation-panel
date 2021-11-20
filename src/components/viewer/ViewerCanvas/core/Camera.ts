import { EventEmitter2 } from "eventemitter2"
import { Vector2 } from "@free-draw/moderation-client"
import Maid from "../../../../util/Maid"
import Input, { Pointer } from "./Input"

const SCROLL_SCALE_RATE = 0.2

type CameraState = {
	position: Vector2,
	rotation: number,
	scale: number,
}

type CameraInputFrame = Partial<CameraState>

class Camera extends EventEmitter2 {
	public input: Input
	public screen: HTMLElement

	public position: Vector2 = new Vector2(0, 0)
	public rotation: number = 0
	public scale: number = 30

	constructor(input: Input, screen: HTMLElement) {
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

			maid.listen(pointer, "move", (_pointer: Pointer, delta: Vector2) => {
				this.processInputFrame({
					position: delta.inverse(),
				})
			})

			maid.listen(pointer, "up", () => {
				maid.clean()
			})
		})
	}

	public getRelativePosition(screenPosition: Vector2): Vector2 {
		const center = new Vector2(this.screen.offsetWidth, this.screen.offsetHeight).divideScalar(2)
		return screenPosition.subtract(center).divideScalar(this.scale).add(this.position)
	}

	public getState(): CameraState {
		return {
			position: this.position,
			rotation: this.rotation,
			scale: this.scale,
		}
	}

	public processInputFrame(inputFrame: CameraInputFrame): void {
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

	public reset(): void {
		this.position = new Vector2(0, 0)
		this.rotation = 0
		this.scale = 30

		this.emit("update", this.getState())
	}
}

export default Camera