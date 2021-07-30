import lodash from "lodash"
import NodeCache from "node-cache"

const FLUSH_TIMEOUT = 100

class Resource {
	constructor(fulfill, cacheOptions) {
		this.fulfill = fulfill

		this._cache = new NodeCache(lodash.merge({
			stdTTL: 3600,
		}, cacheOptions))

		this._batch = {}
		this._batchPromises = {}
		this._batchReady = true
	}

	flush() {
		if (!this._batchReady) {
			throw new Error("Flush currently active")
		}

		const batch = this._batch

		this._batch = {}
		this._batchPromises = {}
		this._batchReady = false

		lodash.forIn(batch, batchItem => clearTimeout(batchItem.timeout))

		const batchData = lodash.mapValues(batch, batchItem => batchItem.data)
		this.fulfill(batchData).then((results) => {
			lodash.forIn(batch, (batchItem, id) => batchItem.resolve(results[id]))
		}, (error) => {
			lodash.forIn(batch, batchItem => batchItem.reject(error))
		})

		this._batchReady = true
	}

	invoke(id, data) {
		const cachedValue = this._cache.get(id)
		if (cachedValue) {
			return Promise.resolve(cachedValue)
		}

		const cachedPromise = this._batchPromises[id]
		if (cachedPromise) {
			return cachedPromise
		}

		const promise = new Promise((resolve, reject) => {
			const timeout = setTimeout(() => this.flush(), FLUSH_TIMEOUT)
			this._batch[id] = { data, timeout, resolve, reject }
		})
		promise.then(result => this._cache.set(id, result))
		this._batchPromises[id] = promise
		return promise
	}

	createInvoker(options) {
		const { mapId, mapData, mapResult } = options ?? {}

		return async (...args) => {
			const id = mapId ? mapId(...args) : args[0]
			const data = mapData ? mapData(...args) : args[0]
			const result = await this.invoke(id, data)
			return mapResult ? mapResult(result, { id, data, args }) : result
		}
	}
}

export default Resource