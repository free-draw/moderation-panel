import React from "react"

export default function useAsync(func, deferred) {
	return (...args) => {
		const [ result, setResult ] = React.useState(null)
		React.useEffect(async () => {
			setResult(null)
			if (!deferred) {
				setResult(await func(...args))
			}
		}, [ deferred, ...args ])
		return result
	}
}