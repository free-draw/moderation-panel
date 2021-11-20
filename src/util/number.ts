export function lerp(rangeStart: number, rangeEnd: number, alpha: number): number {
	return rangeStart + (rangeEnd - rangeStart) * alpha
}

export function map(value: number, fromRangeStart: number, fromRangeEnd: number, toRangeStart: number, toRangeEnd: number): number {
	return (((value - fromRangeStart) * (toRangeEnd - toRangeStart)) / (fromRangeEnd - fromRangeStart)) + toRangeStart
}

export function clamp(value: number, rangeStart: number, rangeEnd: number): number {
	return Math.min(rangeEnd, Math.max(rangeStart, value))
}

export function modulo(value: number, divider: number): number {
	value %= divider
	if (value < 0) {
		value += divider
	}
	return value
}

export function getAngleDelta(angleA: number, angleB: number): number {
	let delta = modulo(angleB - angleA, Math.PI * 2)

	if (delta > Math.PI) {
		delta = delta - (Math.PI * 2)
	}

	return delta
}