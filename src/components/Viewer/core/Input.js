import EventEmitter from "eventemitter2"

import Vector2 from "/src/class/Vector2"
import Maid from "/src/class/Maid"

function getEventPosition(event) {
	return new Vector2(event.offsetX, event.offsetY)
}

class Pointer extends EventEmitter {
	constructor(initialEvent) {
		super()
		
		this.active = false
		this.position = getEventPosition(initialEvent)
	}

	onPointerDown(event) {
		this.active = true
		this.emit("down", getEventPosition(event))
	}

	onPointerMove(event) {
		const position = getEventPosition(event)
		const delta = position.subtract(this.position)
		this.position = position
		this.emit("move", position, delta)
	}

	onPointerUp(event) {
		this.active = false
		this.emit("up", getEventPosition(event))
	}
}

class Input extends EventEmitter {
	constructor(element) {
		super()

		this.pointers = {}
		this.maid = new Maid()

		this.maid.listen(element, "pointerenter", this.createPointer.bind(this))
		this.maid.listen(element, "pointerout", this.destroyPointer.bind(this))

		this.maid.listen(element, "pointerdown", this.createEventHandler("onPointerDown"))
		this.maid.listen(element, "pointermove", this.createEventHandler("onPointerMove"))
		this.maid.listen(element, "pointerup", this.createEventHandler("onPointerUp"))

		this.maid.listen(element, "wheel", (event) => {
			const scroll = -event.deltaY / 100
			const position = getEventPosition(event)
			this.emit("scroll", scroll, position)
		})

		this.maid.listen(element, "contextmenu", (event) => {
			event.preventDefault()
		})
	}

	createEventHandler(eventName) {
		return (event) => {
			const pointer = this.pointers[event.pointerId]
			if (pointer && pointer[eventName]) {
				pointer[eventName].call(pointer, event)
			}
		}
	}

	createPointer(event) {
		const pointer = new Pointer(event)

		pointer.onAny((event, ...values) => {
			this.emit(event, pointer, ...values)
		})

		this.pointers[event.pointerId] = pointer
	}

	destroyPointer(event) {
		delete this.pointers[event.pointerId]
	}

	destroy() {
		this.maid.clean()
	}
}

export default Input