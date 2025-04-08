export type EnergyUnit = 'kWh' | 'MWh' | 'GWh';

export function getClosestEnergyUnit(value: number): EnergyUnit {
	if (value < 1000) return 'kWh';
	if (value < 1000000) return 'MWh';

	return 'GWh';
}

export function convertKWhTo(valueInKWh: number, newUnit: EnergyUnit) {
	if (newUnit === 'GWh') return valueInKWh / 1000000;
	if (newUnit === 'MWh') return valueInKWh / 1000;

	return valueInKWh;
}
