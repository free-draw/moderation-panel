import React from "react"

function useStaticValue<T>(callback: () => T): T {
	const [ init, setInit ] = React.useState(true)
	const [ value ] = React.useState<T | null>(init ? callback() : null)
	React.useEffect(() => setInit(false), [])
	return value as T
}

export default useStaticValue