type EnergyUnit = 'kWh' | 'MWh' | 'GWh';

export function getClosestEnergyUnit(value: number): EnergyUnit {
	if (value < 1000) return 'kWh';
	if (value < 1000000000) return 'MWh';

	return 'GWh';
}

/**
 *
 * @param valueToRound
 * @param valueToRoundTo
 * @returns
 * @example
 * 10, 1000 -> 10
 * 1000, 1000 -> 1
 * 250000, 1000 - > 250
 */
export function roundToClosest(valueToRound: number, valueToRoundTo: number): number {
	return Math.max(valueToRound, Math.round(valueToRound / valueToRoundTo));
}
