import { Vector2 } from "@free-draw/moderation-client"
import { EventEmitter2 } from "eventemitter2"

import Maid from "../../../../util/Maid"

function getEventPosition(event: MouseEvent): Vector2 {
	return new Vector2(event.offsetX, event.offsetY)
}

export type PointerMethod = "onPointerDown" | "onPointerMove" | "onPointerUp"

export class Pointer extends EventEmitter2 {
	public active: boolean
	public position: Vector2

	constructor(initialEvent: PointerEvent) {
		super()

		this.active = false
		this.position = getEventPosition(initialEvent)
	}

	protected onPointerDown(event: PointerEvent): void {
		this.active = true
		this.emit("down", getEventPosition(event))
	}

	protected onPointerMove(event: PointerEvent): void {
		const position = getEventPosition(event)
		const delta = position.subtract(this.position)
		this.position = position
		this.emit("move", position, delta)
	}

	protected onPointerUp(event: PointerEvent): void {
		this.active = false
		this.emit("up", getEventPosition(event))
	}
}

class Input extends EventEmitter2 {
	public pointers: Record<string, Pointer> = {}
	public maid: Maid = new Maid()

	constructor(element: HTMLElement) {
		super()

		this.maid.listen(element, "pointerenter", this.createPointer.bind(this))
		this.maid.listen(element, "pointerout", this.destroyPointer.bind(this))

		this.maid.listen(element, "pointerdown", this.createEventHandler("onPointerDown"))
		this.maid.listen(element, "pointermove", this.createEventHandler("onPointerMove"))
		this.maid.listen(element, "pointerup", this.createEventHandler("onPointerUp"))

		this.maid.listen(element, "wheel", ((event: WheelEvent) => {
			const scroll = -event.deltaY / 100
			const position = getEventPosition(event)
			this.emit("scroll", scroll, position)
		}) as EventListener)

		this.maid.listen(element, "contextmenu", (event: Event) => {
			event.preventDefault()
		})
	}

	public createEventHandler(eventName: PointerMethod): (event: Event) => void
	public createEventHandler(eventName: PointerMethod): (event: PointerEvent) => void {
		return (event: PointerEvent) => {
			const pointer = this.pointers[event.pointerId]
			if (pointer && pointer[eventName]) {
				pointer[eventName].call(pointer, event)
			}
		}
	}

	private createPointer(event: Event): void
	private createPointer(event: PointerEvent): void {
		const pointer = new Pointer(event)

		pointer.onAny((event, ...values) => {
			this.emit(event, pointer, ...values)
		})

		this.pointers[event.pointerId] = pointer
	}

	private destroyPointer(event: Event): void
	private destroyPointer(event: PointerEvent): void {
		delete this.pointers[event.pointerId]
	}

	public destroy(): void {
		this.maid.clean()
	}
}

export default Input