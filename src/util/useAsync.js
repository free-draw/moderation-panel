import React from "react"

export default function useAsync(func) {
	return (...args) => {
		const [ result, setResult ] = React.useState(null)
		React.useEffect(async () => {
			setResult(null)
			setResult(await func(...args))
		}, args)
		return result
	}
}