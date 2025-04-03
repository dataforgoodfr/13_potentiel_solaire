export function formatNumber(value: number): string {
	return new Intl.NumberFormat('fr-FR').format(value);
}

/**
 * @param valueToRound
 * @param valueToRoundTo
 * @returns
 * @example
 * 10, 1000 -> 10
 * 1000, 1000 -> 1
 * 250000, 1000 - > 250
 */
export function roundToClosest(valueToRound: number, valueToRoundTo: number): number {
	return Math.min(valueToRound, Math.round(valueToRound / valueToRoundTo));
}
