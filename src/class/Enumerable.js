class EnumerableItem {
	constructor(enumerable, name, value) {
		this.enumerable = enumerable
		this.name = name
		this.value = value
	}

	toString() {
		return `EnumerableItem(${this.name}: ${this.value})`
	}
}

class Enumerable {
	constructor(name, values) {
		this._name = name

		if (Array.isArray(values)) {
			this._items = values.map((value) => {
				return new EnumerableItem(this, value, value)
			})
		} else {
			this._items = Object.entries(values).map(([ name, value ]) => {
				return new EnumerableItem(this, name, value)
			})
		}
	}

	fromName(name) {
		return this[name]
	}

	fromValue(value) {
		return this._items.find(item => item.value === value)
	}

	items() {
		return this._items
	}

	names() {
		return this._items.map(item => item.name)
	}

	toString() {
		return `Enumerable(${this._name})`
	}
}

export default Enumerable