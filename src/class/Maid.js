function connect(target, eventName, callback) {
	if (target instanceof EventTarget) {
		target.addEventListener(eventName, callback)
	} else {
		target.addListener(eventName, callback)
	}
}

function disconnect(target, eventName, callback) {
	if (target instanceof EventTarget) {
		target.removeEventListener(eventName, callback)
	} else {
		target.removeListener(eventName, callback)
	}
}

class Maid {
	constructor() {
		this.callbacks = []
		this.locked = false
	}

	addCallback(callback) {
		if (this.locked) {
			throw new Error("Maid is locked")
		}

		this.callbacks.push(callback)
	}

	listen(target, eventName, callback) {
		connect(target, eventName, callback)
		this.addCallback(disconnect.bind(null, target, eventName, callback))
	}

	clean() {
		this.callbacks.forEach(callback => callback())
		this.locked = true
	}
}

export default Maid