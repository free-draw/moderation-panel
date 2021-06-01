function lerp(rangeStart, rangeEnd, alpha) {
	return rangeStart + (rangeEnd - rangeStart) * alpha
}

function map(value, fromRangeStart, fromRangeEnd, toRangeStart, toRangeEnd) {
	return (((value - fromRangeStart) * (toRangeEnd - toRangeStart)) / (fromRangeEnd - fromRangeStart)) + toRangeStart
}

function clamp(value, rangeStart, rangeEnd) {
	return Math.min(rangeEnd, Math.max(rangeStart, value))
}

function modulo(value, divider) {
	value %= divider
	if (value < 0) {
		value += divider
	}
	return value
}

function getAngleDelta(angleA, angleB) {
	let delta = modulo(angleB - angleA, Math.PI * 2)

	if (delta > Math.PI) {
		delta = delta - (Math.PI * 2)
	}

	return delta
}

export {
	lerp,
	map,
	clamp,
	modulo,
	getAngleDelta,
}