import React from "react"

// TODO: Remove this when upgrading to TypeScript 4.5
type Awaited<P extends Promise<any>> = P extends Promise<infer T> ? T : never

type UseAsyncFunction = (...args: any[]) => Promise<any>

function useAsync<F extends UseAsyncFunction>(
	callback: F,
	dependencies?: any[],
	defer?: boolean
): (...args: Parameters<F>) => Awaited<ReturnType<F>> | null {
	return (...args) => {
		const [ result, setResult ] = React.useState<Awaited<ReturnType<F>> | null>(null)

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