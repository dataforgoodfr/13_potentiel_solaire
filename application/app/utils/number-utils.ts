export function getEnergyUnit(value: number) {
	if (value < 1000) return 'Wh';
	if (value < 1000000) return 'kWh';
	if (value < 1000000000) return 'MWh';

	return 'GWh';
}

export function showNumber(value: number) {
	return new Intl.NumberFormat('fr-FR').format(value);
}
