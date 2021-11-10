import { EventEmitter2 } from "eventemitter2"

type EmitterCallbackLike = () => void

type DOMEmitterLike = {
	addEventListener(eventName: string, callback: EmitterCallbackLike): any,
	removeEventListener(eventName: string, callback: EmitterCallbackLike): any,
}

type EventEmitterLike = {
	on(event: string, callback: EmitterCallbackLike): any,
	off(event: string, callback: EmitterCallbackLike): any,
	addListener(event: string, callback: EmitterCallbackLike): any,
	removeListener(event: string, callback: EmitterCallbackLike): any,
}

type EmitterLike = DOMEmitterLike | EventEmitterLike

function connect(target: EmitterLike, event: string, callback: EmitterCallbackLike) {
	if (target instanceof EventTarget) {
		target.addEventListener(event, callback)
	} else if (target instanceof EventEmitter2) {
		target.addListener(event, callback)
	}
}

function disconnect(target: EmitterLike, event: string, callback: EmitterCallbackLike) {
	if (target instanceof EventTarget) {
		target.removeEventListener(event, callback)
	} else if (target instanceof EventEmitter2) {
		target.removeListener(event, callback)
	}
}

type MaidCallback = () => void

class Maid {
	private callbacks: MaidCallback[] = []
	public locked: boolean  = false

	public addCallback(callback: MaidCallback): void {
		if (this.locked) {
			throw new Error("Maid is locked")
		}

		this.callbacks.push(callback)
	}

	public listen<E extends EventEmitterLike>(target: E, ...args: Parameters<E["on"]>): void
	public listen<E extends DOMEmitterLike>(target: E, ...args: Parameters<E["addEventListener"]>): void
	public listen(target: EmitterLike, event: string, callback: EmitterCallbackLike): void {
		connect(target, event, callback)
		this.addCallback(disconnect.bind(null, target, event, callback))
	}

	public clean(): void {
		this.callbacks.forEach(callback => callback())
		this.locked = true
	}
}

export default Maid