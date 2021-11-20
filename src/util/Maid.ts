type EmitterCallbackLike = () => void

type EventTargetLike = {
	addEventListener(eventName: string, callback: EmitterCallbackLike): any,
	removeEventListener(eventName: string, callback: EmitterCallbackLike): any,
}

type EventEmitterLike = {
	on(event: string, callback: EmitterCallbackLike): any,
	off(event: string, callback: EmitterCallbackLike): any,
}

type EmitterLike = EventTargetLike | EventEmitterLike

function connect(target: EmitterLike, event: string, callback: EmitterCallbackLike) {
	if (target instanceof EventTarget) {
		(target as EventTargetLike).addEventListener(event, callback)
	} else {
		(target as EventEmitterLike).on(event, callback)
	}
}

function disconnect(target: EmitterLike, event: string, callback: EmitterCallbackLike) {
	if (target instanceof EventTarget) {
		(target as EventTargetLike).removeEventListener(event, callback)
	} else {
		(target as EventEmitterLike).off(event, callback)
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
	public listen<E extends EventTargetLike>(target: E, ...args: Parameters<E["addEventListener"]>): void
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