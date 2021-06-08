export default function makeClassName(defaultClassName, flags) {
	const className = [ defaultClassName ]

	if (typeof flags === "object") {
		if (Array.isArray(flags)) {
			flags.forEach((flag) => {
				if (flag) {
					className.push(flag)
				}
			})
		} else {
			Object.keys(flags).forEach((flag) => {
				if (flags[flag]) {
					className.push(flag)
				}
			})
		}
	}

	return className.join(" ")
}