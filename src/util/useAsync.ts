import React from "react"

type UseAsyncCallback<P extends any[], T> = (...args: P) => Promise<T>
type UseAsyncCaller<P extends any[], T> = (...args: P) => T | null

function useAsync<P extends any[], T>(
	callback: UseAsyncCallback<P, T>,
	dependencies: any[],
	defer: boolean
): UseAsyncCaller<P, T> {
	return (...args) => {
		const [ result, setResult ] = React.useState<T | null>(null)

		React.useEffect(() => {
			setResult(null)

			if (!defer) {
				callback(...args).then(setResult)
			}
		}, [ defer, ...(dependencies ?? args) ])

		return result
	}
}

export default useAsync